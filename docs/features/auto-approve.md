# Auto-Approve & Verifikasi Dokumen

## Deskripsi

Sistem auto-approve memungkinkan peminjaman alat dan booking ruangan disetujui **secara otomatis** jika mahasiswa melampirkan surat resmi (surat izin / surat permohonan) yang valid. Dokumen yang diunggah diverifikasi melalui 2 tahap: validasi file (PDF, ukuran, struktur) dan pencocokan keyword teks terhadap template surat resmi UAI.

## User Access

| Role | Akses |
|------|-------|
| **Mahasiswa/Dosen** | Upload surat → mendapat auto-approve jika terverifikasi |
| **Admin** | Review manual untuk surat yang tidak terverifikasi |

---

## Alur Proses

### 1. Flow Utama (Dengan Surat)

```
[User] Upload Surat PDF
         ↓
  ┌─ Level 1: Validasi File ──────────────────┐
  │  • Ekstensi PDF?                           │
  │  • Ukuran > 5KB?                           │
  │  • Magic bytes %PDF-?                      │
  │  • Minimal 1 halaman?                      │
  └──────────────┬────────────────────────────┘
                 ↓
  ┌─ Level 2: Keyword Matching ────────────────┐
  │  • Ekstrak teks via pdf-parse              │
  │  • Cocokkan 13 keyword UAI                 │
  │  • Hitung score (0-100%)                   │
  └──────────────┬────────────────────────────┘
                 ↓
       Score ≥ 50%?
      ┌────┴────┐
    Ya          Tidak
     ↓            ↓
  ✅ Auto-Approve   ⚠️ Pending
  Status: Disetujui  Status: Pending
                     (Admin review)
```

### 2. Flow Tanpa Surat

```
[User] Ajukan tanpa surat → Status: Pending → [Admin] Validasi manual
```

### 3. Pengembalian (Return Photo)

```
[Mahasiswa] Upload foto bukti pengembalian → Auto-verified → Selesai
[Mahasiswa] Tanpa foto → Pending → [Admin] Validasi
```

> **Catatan:** Verifikasi keyword hanya berlaku untuk surat (PDF). Foto pengembalian hanya melewati validasi file dasar.

---

## Titik Auto-Approve

| # | Fitur | File | Trigger | Kondisi Auto-Approve |
|---|-------|------|---------|----------------------|
| 1 | Peminjaman Alat | `features/loans/service.ts` | `suratIzin` + `suratVerified` | Surat PDF valid + ≥50% keyword |
| 2 | Booking Ruangan | `features/bookings/service.ts` | `suratPermohonan` + `suratVerified` | Surat PDF valid + ≥50% keyword |
| 3 | Pengembalian | `features/loans/service.ts` | `returnPhoto` | Foto bukti ada |

---

## Verifikasi Dokumen

### Level 1: Validasi File

| Cek | Kriteria | Aksi Gagal |
|-----|----------|------------|
| Ekstensi | Hanya `.pdf` | Tolak upload |
| Ukuran | Minimal 5KB | Tolak (file kosong/dummy) |
| Magic bytes | Header `%PDF-` | Tolak (bukan PDF asli) |
| Halaman | Minimal 1 halaman berisi | Tolak (PDF rusak) |

### Level 2: Keyword Matching

Teks diekstrak menggunakan library `pdf-parse`, lalu dicocokkan terhadap keyword secara **case-insensitive**.

#### Keyword Bersama (Shared) — 7 keyword

| # | Keyword |
|---|---------|
| 1 | UNIVERSITAS AL-AZHAR INDONESIA |
| 2 | FAKULTAS SAINS DAN TEKNOLOGI |
| 3 | Informatika |
| 4 | Nomor |
| 5 | Perihal |
| 6 | Lampiran |
| 7 | Menyetujui |

#### Keyword per Tipe — 6 grup (salah satu cocok dalam grup = match)

| # | Grup Keyword | Tipe |
|---|-------------|------|
| 1 | peminjaman | Kedua |
| 2 | permohonan | Kedua |
| 3 | kegiatan | Kedua |
| 4 | Dekan / Wakil Dekan / Rektor | suratIzin |
| 4 | Ketua Program Studi / Dekan / Wakil Dekan | suratPermohonan |
| 5 | Ketua Pelaksana / Ketua Himpunan | Kedua |
| 6 | ttd / tanda tangan / Tanda Tangan | Kedua |

#### Threshold

| Score | Hasil | Status |
|-------|-------|--------|
| ≥ 50% (≥7/13 keyword) | ✅ Valid | `Disetujui` (auto-approve) |
| < 50% | ⚠️ Tidak lengkap | `Pending` (review admin) |

> **Tidak ada penolakan otomatis.** Semua dokumen yang lolos validasi file tetap diterima dan disimpan, hanya status auto-approve yang berbeda.

---

## Data Model

Tidak ada perubahan skema database. Verifikasi dilakukan **saat upload** dan hasilnya diteruskan sebagai parameter `suratVerified: boolean` melalui service layer.

### Field Terkait di `item_loans`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| suratIzin | VARCHAR | Path file surat izin |
| status | ENUM | Disetujui (auto) / Pending (manual) |

### Field Terkait di `room_bookings`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| suratPermohonan | VARCHAR | Path file surat permohonan |
| status | ENUM | Disetujui (auto) / Pending (manual) |

---

## API Upload

### Endpoint

```
POST /api/upload?verify=true&type={suratIzin|suratPermohonan}
```

### Request

- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` — File PDF
  - `folder` — `surat-izin` atau `surat-permohonan`

### Response

```json
{
  "success": true,
  "path": "/uploads/surat-izin/1707123456-Surat_Izin.pdf",
  "filename": "1707123456-Surat_Izin.pdf",
  "verification": {
    "valid": true,
    "score": 77,
    "matchedKeywords": ["UNIVERSITAS AL-AZHAR INDONESIA", "Informatika", "..."],
    "missingKeywords": ["Lampiran", "..."]
  }
}
```

### Folder PDF-Only

Folder `surat-izin` dan `surat-permohonan` hanya menerima file PDF. Upload gambar (JPG/PNG) akan ditolak dengan error `"Surat harus dalam format PDF."`.

---

## Service Layer

### Loans — `features/loans/service.ts`

| Method | Perubahan |
|--------|-----------|
| `create(data)` | `suratVerified` ditambahkan ke `CreateLoanInput`. Auto-approve hanya jika `suratIzin && suratVerified === true` |

### Bookings — `features/bookings/service.ts`

| Method | Perubahan |
|--------|-----------|
| `create(data)` | `suratVerified` ditambahkan ke `CreateBookingInput`. Auto-approve hanya jika `suratPermohonan && suratVerified === true` |

---

## Server Actions

### Loans — `features/loans/actions.ts`

| Action | Perubahan |
|--------|-----------|
| `createLoanRequest()` | Menerima `suratVerified?: boolean` |
| `requestItemLoan()` | Menerima `permitVerified?: boolean`, diteruskan ke service |

### Bookings — `features/bookings/actions.ts`

| Action | Perubahan |
|--------|-----------|
| `createRoomBooking()` | Menerima `suratVerified?: boolean` |

---

## Komponen UI

### Form Peminjaman — `app/student/items/_components/ItemCard.tsx`

- Input file dibatasi **PDF only** (`.pdf`)
- Upload ke `/api/upload?verify=true&type=suratIzin`
- Pesan sukses kontekstual:
  - ✅ Terverifikasi → "Surat izin terverifikasi, peminjaman langsung disetujui"
  - ⚠️ Tidak terverifikasi → "Surat izin perlu review manual oleh admin"
  - 📋 Tanpa surat → "Mohon tunggu validasi dari admin"

### Form Booking — `features/bookings/components/RoomBookingClient.tsx`

- Input file dibatasi **PDF only** (`.pdf`)
- Upload ke `/api/upload?verify=true&type=suratPermohonan`
- Pesan sukses kontekstual (sama seperti di atas)

### Form QR Pinjam — `app/items/[qrCode]/pinjam/page.tsx`

- Server-side form, upload via `fetch` ke API
- PDF only, folder `surat-izin`
- `permitVerified` diteruskan ke `requestItemLoan()`

---

## Utility

### `lib/documentVerifier.ts`

| Method | Deskripsi |
|--------|-----------|
| `validateFile(filePath)` | Level 1: Cek exist, ukuran, magic bytes, halaman PDF |
| `verifyDocument(filePath, type)` | Level 2: Ekstrak teks + keyword matching |
| `verify(filePath, type)` | Pipeline lengkap: Level 1 + Level 2 |

### Dependency

| Package | Versi | Fungsi |
|---------|-------|--------|
| `pdf-parse` | ^1.1.1 | Ekstrak teks dari PDF (pure JS, tanpa native deps) |

---

## Security

- File selalu disimpan meskipun verifikasi gagal (untuk audit trail)
- Verifikasi dilakukan server-side di upload route (tidak bisa di-bypass dari client)
- Keyword matching case-insensitive untuk fleksibilitas
- Folder surat enforce PDF-only di server (bukan hanya di `accept` attribute)

---

## Halaman Terkait

| Route | Fitur Auto-Approve |
|-------|--------------------|
| `/student/items` | Upload surat izin → auto-approve peminjaman |
| `/student/rooms` | Upload surat permohonan → auto-approve booking |
| `/items/[qrCode]/pinjam` | Upload surat izin via QR scan → auto-approve |
| `/admin/validations` | Review manual untuk surat yang tidak terverifikasi |

## Relasi dengan Fitur Lain

- **Loans**: Surat izin → auto-approve peminjaman
- **Bookings**: Surat permohonan → auto-approve booking
- **Dashboard**: Notifikasi admin untuk item auto-approved
- **Upload API**: Endpoint tunggal untuk semua file upload dengan verifikasi opsional
