# Inventaris (Inventory)

## Deskripsi

Fitur inventaris mengelola aset laboratorium (alat/perangkat). Admin dapat mengelola katalog alat, kategori, dan ruangan penyimpanan.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Full CRUD (Alat, Kategori, Ruangan) |
| **Mahasiswa** | Read Only (Lihat katalog alat tersedia) |

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

## Server Actions

Action file: `features/inventory/actions.ts`

| Action | Deskripsi |
|--------|-----------|
| `getItems()` | Ambil semua alat |
| `getCategories()` | Ambil kategori |
| `getRooms()` | Ambil ruangan |
| `createItem()` | Tambah alat baru (Admin) |
| `updateItem()` | Update alat (Admin) |
| `deleteItem()` | Hapus alat (Admin) |
| `createCategory()` | Tambah kategori |
| `updateCategory()` | Update kategori |
| `deleteCategory()` | Hapus kategori |
| `updateItemStatus()` | Update status manual (Maintenance/Tersedia) |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/inventory` | Manajemen alat, kategori, ruangan |
| `/student/items` | Katalog alat tersedia |
| `/items/[qrCode]` | Public detail alat (Scan QR) |

## Security

Semua action mutasi (create, update, delete) dilindungi dengan `requireAdmin()`.

## Relasi

- **Rooms**: Alat disimpan di ruangan (`rooms.id`)
- **Loans**: Alat dipinjam di fitur Loans
