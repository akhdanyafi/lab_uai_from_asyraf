# Peminjaman Alat (Item Loans)

## Deskripsi

Fitur peminjaman memungkinkan mahasiswa mengajukan peminjaman alat yang tersedia di inventaris. Proses ini melibatkan validasi admin dan alur pengembalian.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Validasi booking, validasi pengembalian, riwayat |
| **Mahasiswa** | Request peminjaman, Request pengembalian |

## Alur Proses

### 1. Peminjaman (Loan)

```
[Mahasiswa] Pilih Alat → Ajukan Loan (set tanggal)
                              ↓
                    Loan Status: "Pending"
                    Item Status: Tetap "Tersedia"
                              ↓
                    [Admin] Validasi Request
                              ↓
        ┌─────── Disetujui ───────┬─────── Ditolak ───────┐
        ↓                         ↓                       ↓
   Loan: "Disetujui"         Loan: "Ditolak"         (Selesai)
   Item: "Dipinjam"          Item: Tetap "Tersedia"
```

### 2. Pengembalian (Return)

```
[Mahasiswa] Klik "Kembalikan" (Upload Foto Bukti)
                    ↓
   Return Status: "Dikembalikan" (Auto-check jika ada foto)
        ATAU
   Return Status: "Pending" (Jika butuh cek manual)
                    ↓
   [Admin] Validasi Akhir (jika perlu)
                    ↓
   Item Status: "Tersedia"
```

### 3. QR Code Flow (Alternatif)

Memudahkan peminjaman dengan scan kode fisik pada alat.

```
[User] Scan QR Code fisik
        ↓
Buka URL: /items/[kode-unik]
        ↓
    Cek Status Alat
   ┌────┴────────────────────────┐
Tersedia                   Dipinjam/Maintenance
   ↓                             ↓
Tombol "Pinjam Alat Ini"    (Tampilkan Info Status)
   ↓
(Login jika belum)
   ↓
Form Peminjaman
   ↓
(Lanjut ke alur 1)
```

## Data Model

### Tabel `item_loans`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID peminjaman |
| studentId | INT (FK) | Mahasiswa peminjam |
| itemId | INT (FK) | Alat yang dipinjam |
| validatorId | INT (FK) | Admin yang validasi |
| requestDate | DATETIME | Tanggal pengajuan |
| returnPlanDate | DATETIME | Rencana tanggal kembali |
| actualReturnDate | DATETIME | Tanggal pengembalian aktual |
| status | ENUM | Pending, Disetujui, Ditolak |
| returnStatus | ENUM | Pending, Dikembalikan, Ditolak |
| returnPhoto | VARCHAR | Bukti foto pengembalian |

## Server Actions

Action file: `features/loans/actions.ts`

| Action | Deskripsi |
|--------|-----------|
| `getAvailableItems()` | Alat yg bisa dipinjam |
| `createLoanRequest()` | Ajukan peminjaman |
| `getLoanRequests()` | Daftar pinjaman (Admin/Diri sendiri) |
| `updateLoanStatus()` | Approve/Reject Loan (Admin) |
| `requestItemReturn()` | Mahasiswa ajukan kembali |
| `approveReturn()` | Admin setujui kembali |
| `rejectReturn()` | Admin tolak kembali |
| `deleteLoan()` | Hapus record (Admin) |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/student/loans` | Daftar pinjaman saya |
| `/admin/validations` (Tab Peminjaman) | Validasi request baru |
| `/admin/validations` (Tab Riwayat) | History & Return approval |

## Security

- User hanya bisa lihat pinjaman sendiri
- Admin bisa akses semua data
- Action mutasi admin dilindungi `requireAdmin()`

## Relasi

- **Users**: Peminjam (`users.id`)
- **Inventory**: Barang yang dipinjam (`items.id`)
