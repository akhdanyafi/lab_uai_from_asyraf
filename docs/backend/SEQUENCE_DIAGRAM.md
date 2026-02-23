# Sequence Diagram — Fitur Peminjaman Alat (Item Loan)

Dokumentasi sequence diagram menggunakan PlantUML untuk alur peminjaman alat laboratorium, termasuk mekanisme **Auto-Approve** via verifikasi dokumen surat izin.

---

## 1. Sequence Diagram Lengkap — Peminjaman dengan Auto-Approve

Diagram ini mencakup seluruh alur: request, upload surat, verifikasi dokumen, auto-approve, dan fallback ke manual review.

```plantuml
@startuml seq-loan-auto-approve

skinparam sequenceArrowThickness 2
skinparam participantPadding 20
skinparam boxPadding 10

title Sequence Diagram — Peminjaman Alat dengan Auto-Approve

actor "Mahasiswa" as Student
participant "Frontend\n(ItemCard / PinjamPage)" as UI
participant "Upload API\n(/api/upload)" as UploadAPI
participant "DocumentVerifier\n(lib/documentVerifier.ts)" as Verifier
participant "Server Action\n(createLoanRequest)" as Action
participant "LoanService\n(service.ts)" as Service
database "Database\n(MySQL)" as DB
actor "Admin" as Admin

== Mahasiswa Mengisi Form Peminjaman ==

Student -> UI : Scan QR Code / Pilih Item
UI -> UI : Tampilkan form peminjaman\n(organisasi, tujuan, tanggal,\ndosen pembimbing, surat izin)

alt Mahasiswa Upload Surat Izin (PDF)

    == Upload & Verifikasi Dokumen ==

    Student -> UI : Upload file PDF surat izin
    UI -> UploadAPI : POST /api/upload\n?folder=surat-izin&verify=true&type=suratIzin
    
    UploadAPI -> UploadAPI : Validasi tipe file\n(hanya PDF yang diterima)
    
    alt File bukan PDF
        UploadAPI --> UI : ❌ 400 "Hanya file PDF yang diizinkan"
        UI --> Student : Tampilkan error
    else File adalah PDF
        UploadAPI -> UploadAPI : Simpan file ke\n/public/uploads/surat-izin/
        
        UploadAPI -> Verifier : verify(filePath, "suratIzin")
        
        == Level 1: Validasi File ==
        
        Verifier -> Verifier : validateFile(filePath)
        note right of Verifier
            1. Cek file ada (fs.access)
            2. Cek ukuran minimum (>5KB)
            3. Cek magic bytes PDF (%PDF-)
            4. Cek jumlah halaman (≥1)
        end note
        
        alt File tidak valid
            Verifier --> UploadAPI : { fileValid: false, reason: "..." }
            UploadAPI --> UI : ✅ 200\n{ filePath, verification: { valid: false } }
            UI -> UI : Set suratVerified = false
            UI --> Student : ⚠️ "File tidak valid, akan direview manual"
        else File valid
        
            == Level 2: OCR & Keyword Matching ==
            
            Verifier -> Verifier : verifyDocument(filePath, "suratIzin")
            note right of Verifier
                1. Extract text via pdf-parse
                2. Cocokkan shared keywords (10):
                   - UNIVERSITAS AL-AZHAR INDONESIA
                   - FAKULTAS SAINS DAN TEKNOLOGI
                   - Informatika, Nomor, Perihal,
                   - Lampiran, Menyetujui, ttd,
                   - Hari & tanggal, Waktu
                3. Cocokkan type-specific keywords (3):
                   - peminjaman/kegiatan
                   - Dekan/Wakil Dekan/Rektor
                   - Ketua Pelaksana/Ketua Himpunan
                4. Hitung score:
                   score = (matched / total) × 100
                5. valid = score ≥ 50%
            end note
            
            alt Score ≥ 50% (Verified)
                Verifier --> UploadAPI : { valid: true, score: 75,\nmatchedKeywords: [...] }
                UploadAPI --> UI : ✅ 200\n{ filePath, verification: { valid: true, score: 75 } }
                UI -> UI : Set suratVerified = true
                UI --> Student : ✅ "Surat terverifikasi — akan di-auto-approve"
            else Score < 50% (Not Verified)
                Verifier --> UploadAPI : { valid: false, score: 30,\nmissingKeywords: [...] }
                UploadAPI --> UI : ✅ 200\n{ filePath, verification: { valid: false, score: 30 } }
                UI -> UI : Set suratVerified = false
                UI --> Student : ⚠️ "Surat belum memenuhi syarat,\nakan direview manual"
            end
        end
    end

else Tanpa Surat Izin
    UI -> UI : suratIzin = null\nsuratVerified = false
end

== Submit Form Peminjaman ==

Student -> UI : Klik "Ajukan Peminjaman"
UI -> Action : createLoanRequest({\n  itemId, studentId,\n  suratIzin, suratVerified,\n  organisasi, purpose, ... })

Action -> Action : Validasi input\n(sessionCheck, required fields)
Action -> Service : LoanService.create(input)

Service -> DB : SELECT item WHERE id = itemId
DB --> Service : Item data

alt Item tidak tersedia
    Service --> Action : ❌ Error "Item tidak tersedia"
    Action --> UI : Error
    UI --> Student : ❌ "Item sedang dipinjam"
else Item tersedia

    == Logika Auto-Approve ==
    
    alt suratIzin ada DAN suratVerified = true
        note over Service #lightgreen
            **AUTO-APPROVE PATH**
            Surat izin ada dan terverifikasi
            → Status langsung "Disetujui"
        end note
        Service -> DB : INSERT item_loans\n(status: 'Disetujui',\nnotificationRead: '0')
        Service -> DB : UPDATE items\nSET status = 'Dipinjam'\nWHERE id = itemId
        DB --> Service : ✅ OK
        Service --> Action : { loan, autoApproved: true }
        Action --> UI : ✅ Success
        UI --> Student : ✅ "Peminjaman disetujui otomatis!\nSurat izin Anda terverifikasi."
        
        note over Admin
            Notifikasi auto-approve
            muncul di Admin Dashboard
            (DashboardNotifications)
        end note
        
    else suratIzin ada TAPI suratVerified = false
        note over Service #lightyellow
            **PENDING PATH**
            Surat ada tapi verifikasi gagal
            → Status "Pending" untuk review manual
        end note
        Service -> DB : INSERT item_loans\n(status: 'Pending')
        DB --> Service : ✅ OK
        Service --> Action : { loan, autoApproved: false }
        Action --> UI : ✅ Success
        UI --> Student : ⏳ "Pengajuan dikirim,\nmenunggu persetujuan admin"
        
    else Tanpa surat izin
        note over Service #lightyellow
            **PENDING PATH**
            Tidak ada surat izin
            → Status "Pending"
        end note
        Service -> DB : INSERT item_loans\n(status: 'Pending')
        DB --> Service : ✅ OK
        Service --> Action : { loan, autoApproved: false }
        Action --> UI : ✅ Success
        UI --> Student : ⏳ "Pengajuan dikirim,\nmenunggu persetujuan admin"
    end
end

@enduml
```

---

## 2. Sequence Diagram — Validasi Admin (Manual Approval)

Alur ketika admin memvalidasi peminjaman yang berstatus Pending.

```plantuml
@startuml seq-loan-admin-validation

skinparam sequenceArrowThickness 2

title Sequence Diagram — Validasi Peminjaman oleh Admin

actor "Admin" as Admin
participant "Admin Dashboard\n(Validations Page)" as UI
participant "Server Action\n(updateLoanStatus)" as Action
participant "LoanService" as Service
database "Database" as DB
actor "Mahasiswa" as Student

== Admin Membuka Halaman Validasi ==

Admin -> UI : Buka /admin/validations?tab=loans
UI -> Action : getLoanRequests(status: 'Pending')
Action -> Service : LoanService.getAll({status: 'Pending'})
Service -> DB : SELECT item_loans\nJOIN users, items\nWHERE status = 'Pending'
DB --> Service : Daftar peminjaman pending
Service --> Action : loans[]
Action --> UI : Tampilkan tabel peminjaman

== Admin Review Detail ==

Admin -> UI : Lihat detail peminjaman\n(nama mahasiswa, item, tujuan,\norganisasi, surat izin)

alt Surat Izin tersedia
    Admin -> UI : Klik link surat izin
    UI --> Admin : Download / Preview PDF surat izin
end

== Keputusan Admin ==

alt Admin Menyetujui
    Admin -> UI : Klik "Setujui"
    UI -> Action : updateLoanStatus(loanId, 'Disetujui', adminId)
    Action -> Service : LoanService.updateStatus(...)
    Service -> DB : UPDATE item_loans\nSET status = 'Disetujui',\nvalidator_id = adminId
    Service -> DB : UPDATE items\nSET status = 'Dipinjam'
    DB --> Service : ✅ OK
    Service --> Action : Success
    Action --> UI : ✅ Disetujui
    UI --> Admin : Refresh tabel
    note over Student : Peminjaman terlihat di\nStudent Dashboard\n(Active Loans)
    
else Admin Menolak
    Admin -> UI : Klik "Tolak"
    UI -> Action : updateLoanStatus(loanId, 'Ditolak', adminId)
    Action -> Service : LoanService.updateStatus(...)
    Service -> DB : UPDATE item_loans\nSET status = 'Ditolak',\nvalidator_id = adminId
    DB --> Service : ✅ OK
    Service --> Action : Success
    Action --> UI : ❌ Ditolak
    UI --> Admin : Refresh tabel
end

@enduml
```

---

## 3. Sequence Diagram — Pengembalian Alat (Return Flow)

Alur pengembalian alat, termasuk auto-return dengan foto bukti.

```plantuml
@startuml seq-loan-return

skinparam sequenceArrowThickness 2

title Sequence Diagram — Pengembalian Alat (Return)

actor "Mahasiswa" as Student
participant "Frontend\n(Student Dashboard)" as UI
participant "Upload API" as UploadAPI
participant "Server Action\n(requestItemReturn)" as Action
participant "LoanService" as Service
database "Database" as DB
actor "Admin" as Admin

== Mahasiswa Request Pengembalian ==

Student -> UI : Klik "Kembalikan" pada\npeminjaman aktif

alt Upload Foto Bukti Pengembalian

    Student -> UI : Upload foto barang dikembalikan
    UI -> UploadAPI : POST /api/upload\n?folder=return-photos
    UploadAPI -> UploadAPI : Simpan file
    UploadAPI --> UI : { filePath: "/uploads/return-photos/..." }
    
    UI -> Action : requestItemReturn(loanId, returnPhoto)
    Action -> Service : LoanService.requestReturn(loanId, photo)
    
    note over Service #lightgreen
        **AUTO-RETURN PATH**
        Foto bukti tersedia
        → returnStatus langsung "Dikembalikan"
        → Item dikembalikan ke status "Tersedia"
    end note
    
    Service -> DB : UPDATE item_loans\nSET return_status = 'Dikembalikan',\nreturn_photo = filePath,\nactual_return_date = NOW(),\nstatus = 'Selesai',\nreturn_notification_read = '0'
    Service -> DB : UPDATE items\nSET status = 'Tersedia'
    DB --> Service : ✅ OK
    Service --> Action : { autoReturned: true }
    Action --> UI : ✅ Success
    UI --> Student : ✅ "Pengembalian berhasil!\nBarang tercatat dikembalikan."
    
    note over Admin
        Notifikasi auto-return
        muncul di Admin Dashboard
    end note

else Tanpa Foto Bukti

    UI -> Action : requestItemReturn(loanId, null)
    Action -> Service : LoanService.requestReturn(loanId, null)
    
    note over Service #lightyellow
        **PENDING RETURN PATH**
        Tidak ada foto bukti
        → returnStatus = "Pending"
        → Menunggu konfirmasi admin
    end note
    
    Service -> DB : UPDATE item_loans\nSET return_status = 'Pending'
    DB --> Service : ✅ OK
    Service --> Action : { autoReturned: false }
    Action --> UI : ✅ Success
    UI --> Student : ⏳ "Request pengembalian dikirim,\nmenunggu konfirmasi admin"

    == Admin Validasi Pengembalian ==

    Admin -> UI : Buka halaman pending returns
    
    alt Admin Approve Return
        Admin -> UI : Klik "Setujui Pengembalian"
        UI -> Action : approveReturn(loanId, adminId)
        Action -> Service : LoanService.approveReturn(...)
        Service -> DB : UPDATE item_loans\nSET return_status = 'Dikembalikan',\nactual_return_date = NOW(),\nstatus = 'Selesai'
        Service -> DB : UPDATE items\nSET status = 'Tersedia'
        DB --> Service : ✅ OK
        Service --> Action : Success
        Action --> UI : ✅ Dikembalikan
        
    else Admin Reject Return
        Admin -> UI : Klik "Tolak"
        UI -> Action : rejectReturn(loanId)
        Action -> Service : LoanService.rejectReturn(...)
        Service -> DB : UPDATE item_loans\nSET return_status = 'Belum'
        DB --> Service : ✅ OK
        Service --> Action : Success
        Action --> UI : ❌ Ditolak
    end
end

@enduml
```

---

## 4. Sequence Diagram — Alur Verifikasi Dokumen (Detail)

Detail internal proses verifikasi dokumen surat izin oleh `DocumentVerifier`.

```plantuml
@startuml seq-document-verification

skinparam sequenceArrowThickness 2

title Sequence Diagram — Detail Verifikasi Dokumen Surat Izin

participant "Upload API" as API
participant "DocumentVerifier" as DV
participant "File System" as FS
participant "pdf-parse" as PDF

API -> DV : verify(filePath, "suratIzin")

== Level 1: Validasi File ==

DV -> DV : validateFile(filePath)
DV -> FS : access(absolutePath)

alt File tidak ditemukan
    FS --> DV : ❌ Error
    DV --> API : { fileValid: false,\nreason: "File tidak ditemukan" }
else File ada
    FS --> DV : ✅ OK
    DV -> FS : readFile(absolutePath)
    FS --> DV : Buffer
    
    DV -> DV : Cek ukuran\nbuffer.length ≥ 5KB?
    
    alt Ukuran < 5KB
        DV --> API : { fileValid: false,\nreason: "File terlalu kecil" }
    else Ukuran OK
        DV -> DV : Cek magic bytes\nbuffer[0..4] == "%PDF-"?
        
        alt Bukan PDF
            DV --> API : { fileValid: false,\nreason: "Bukan PDF valid" }
        else PDF valid
            DV -> PDF : pdfParse(buffer)
            PDF --> DV : { numpages, text }
            
            alt numpages < 1
                DV --> API : { fileValid: false,\nreason: "PDF tanpa halaman" }
            else Halaman ≥ 1
            
                == Level 2: OCR Keyword Matching ==
                
                DV -> PDF : Extract text content
                PDF --> DV : fullText
                
                DV -> DV : Normalize text\n(toLowerCase)
                
                note over DV
                    **Shared Keywords (10 grup):**
                    ✓ "universitas al-azhar indonesia"
                    ✓ "fakultas sains dan teknologi"
                    ✓ "informatika"
                    ✓ "nomor"
                    ✓ "perihal"
                    ✓ "lampiran"
                    ✓ "menyetujui"
                    ✓ "ttd" / "tanda tangan"
                    ✓ "hari" & "tanggal"
                    ✓ "waktu"
                end note
                
                DV -> DV : Match shared keywords\n(case-insensitive search)
                
                note over DV
                    **Surat Izin Keywords (3 grup):**
                    ✓ "peminjaman" / "kegiatan"
                    ✓ "dekan" / "wakil dekan" / "rektor"
                    ✓ "ketua pelaksana" / "ketua himpunan"
                end note
                
                DV -> DV : Match type-specific keywords
                
                DV -> DV : Hitung score\nscore = (matched / total) × 100\nvalid = score ≥ 50%
                
                DV --> API : {\n  fileValid: true,\n  verification: {\n    valid: score ≥ 50%,\n    score: N,\n    matchedKeywords: [...],\n    missingKeywords: [...]\n  }\n}
            end
        end
    end
end

@enduml
```

---

## Ringkasan Alur

| Skenario | Surat Izin | Verifikasi | Status Awal | Approval |
|----------|------------|------------|-------------|----------|
| Auto-Approve | ✅ Ada (PDF) | ✅ Score ≥ 50% | **Disetujui** | Otomatis |
| Manual Review | ✅ Ada (PDF) | ❌ Score < 50% | **Pending** | Admin review |
| Manual Review | ❌ Tidak ada | — | **Pending** | Admin review |

| Skenario Return | Foto Bukti | Status Return | Approval |
|----------------|------------|---------------|----------|
| Auto-Return | ✅ Ada | **Dikembalikan** | Otomatis |
| Manual Return | ❌ Tidak ada | **Pending** | Admin review |

---

## Cara Render

Gunakan salah satu metode di bawah untuk menghasilkan gambar dari kode PlantUML:

1. **Online**: [plantuml.com/plantuml/uml](https://www.plantuml.com/plantuml/uml/)
2. **VS Code**: Extension `jebbs.plantuml` → `Alt+D` untuk preview
3. **CLI**: `java -jar plantuml.jar SEQUENCE_DIAGRAM.md`
