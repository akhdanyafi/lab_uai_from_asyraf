# Inventaris & Peminjaman Alat (Inventory & Item Loans)

## Deskripsi

Fitur inventaris mengelola aset laboratorium (alat/perangkat) dan proses peminjaman oleh mahasiswa. Admin dapat mengelola katalog alat, sementara mahasiswa dapat mengajukan permintaan peminjaman yang memerlukan validasi admin.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | CRUD alat, kategori, validasi peminjaman, riwayat |
| **Mahasiswa** | Lihat alat tersedia, ajukan peminjaman, kembalikan alat |

## Alur Proses Peminjaman

```
[Mahasiswa] Pilih Alat → Ajukan Peminjaman (set tanggal kembali)
                              ↓
                    Status: "Pending"
                    Item Status: Tetap "Tersedia"
                              ↓
                    [Admin] Validasi Request
                              ↓
        ┌─────── Disetujui ───────┬─────── Ditolak ───────┐
        ↓                         ↓                       ↓
   Loan: "Disetujui"         Loan: "Ditolak"         (Selesai)
   Item: "Dipinjam"          Item: Tetap "Tersedia"
        ↓
   [Mahasiswa] Klik "Kembalikan"
        ↓
   Loan: "Selesai"
   Item: Kembali "Tersedia"
```

## Status Transisi

### Status Item

| Status | Deskripsi |
|--------|-----------|
| `Tersedia` | Alat bisa dipinjam |
| `Dipinjam` | Sedang dipinjam |
| `Maintenance` | Dalam perbaikan, tidak tersedia |

### Status Peminjaman

| Status | Deskripsi |
|--------|-----------|
| `Pending` | Menunggu validasi admin |
| `Disetujui` | Peminjaman disetujui, alat sudah diambil |
| `Ditolak` | Permintaan ditolak |
| `Selesai` | Alat sudah dikembalikan |
| `Terlambat` | Melewati batas waktu pengembalian |

## Data Model

### Tabel `item_categories`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID kategori |
| name | VARCHAR(100) | Nama kategori (Elektronik, Alat Ukur, dll) |

### Tabel `items`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID item |
| categoryId | INT (FK) | Referensi kategori |
| roomId | INT (FK) | Lokasi penyimpanan (ruangan) |
| name | VARCHAR(255) | Nama alat |
| description | TEXT | Deskripsi alat |
| qrCode | VARCHAR(255) | Kode QR unik |
| status | ENUM | Tersedia, Dipinjam, Maintenance |

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
| status | ENUM | Pending, Disetujui, Ditolak, Selesai, Terlambat |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getItems()` | `lib/actions/inventory.ts` | Ambil semua alat |
| `getCategories()` | `lib/actions/inventory.ts` | Ambil kategori |
| `getRooms()` | `lib/actions/inventory.ts` | Ambil ruangan |
| `createItem()` | `lib/actions/inventory.ts` | Tambah alat baru |
| `updateItem()` | `lib/actions/inventory.ts` | Update alat |
| `deleteItem()` | `lib/actions/inventory.ts` | Hapus alat |
| `getAvailableItems()` | `lib/actions/loan.ts` | Alat yang tersedia |
| `createLoanRequest()` | `lib/actions/loan.ts` | Ajukan peminjaman |
| `getLoanRequests()` | `lib/actions/loan.ts` | Daftar peminjaman (admin) |
| `updateLoanStatus()` | `lib/actions/loan.ts` | Validasi peminjaman |
| `getMyLoans()` | `lib/actions/loan.ts` | Peminjaman saya |
| `returnItem()` | `lib/actions/loan.ts` | Kembalikan alat |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/inventory` | Manajemen alat, kategori, ruangan |
| `/admin/validations` (Tab Peminjaman) | Validasi permintaan peminjaman |
| `/student/items` | Katalog alat tersedia |
| `/student/loans` | Peminjaman saya + kembalikan alat |

## Validasi & Business Rules

1. **Satu item hanya bisa dipinjam satu orang** - Status berubah ke "Dipinjam"
2. **Minimal tanggal kembali = besok** - Tidak bisa pinjam untuk hari ini
3. **Alat Maintenance tidak muncul di katalog mahasiswa**
4. **Auto-update status item** saat loan disetujui/selesai

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./user-management.md) | Mahasiswa sebagai peminjam, Admin sebagai validator |
| [Room Booking](./room-booking.md) | Item disimpan di ruangan (roomId) |
| Homepage | Alat maintenance tampil di pengumuman |
