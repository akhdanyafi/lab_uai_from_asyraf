# Modul Praktikum (Practicum Modules)

## Deskripsi

Fitur Modul Praktikum berfungsi sebagai repositori digital untuk materi dan modul praktikum. Sistem ini sangat disederhanakan untuk kemudahan akses tanpa birokrasi kelas atau enrollment.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Full CRUD (Upload, Edit, Hapus Modul) |
| **Dosen** | Full CRUD (Upload, Edit, Hapus Modul) |
| **Mahasiswa** | Read Only (Lihat & Download Modul) |

## Alur Proses

### 1. Upload Modul (Admin/Dosen)

```
[Admin/Dosen] → Upload PDF Modul → Isi Nama & Subject → Save
```

### 2. Akses Modul (Mahasiswa)
```
[Mahasiswa] → Buka Menu Praktikum → Cari/Filter Subject → Download PDF
```

## Data Model

### Tabel `practicum_modules`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID modul |
| name | VARCHAR(255) | Nama modul (misal: "Modul 1: Algoritma") |
| description | TEXT | Deskripsi singkat |
| filePath | VARCHAR(255) | Path file PDF yang diupload |
| subjects | TEXT (JSON) | Array mata kuliah terkait (tagging) |
| createdAt | DATETIME | Waktu upload |
| updatedAt | DATETIME | Waktu update terakhir |

## Server Actions

Semua actions berada di `features/practicum/actions.ts`.

| Action | Deskripsi |
|--------|-----------|
| `getModules()` | Ambil semua modul |
| `getModuleById(id)` | Detail modul |
| `searchModules(query)` | Cari modul berdasarkan nama |
| `getAllSubjects()` | Ambil daftar subject unik untuk filter |
| `createModule(data)` | Upload modul baru |
| `updateModule(id, data)` | Edit data modul |
| `deleteModule(id)` | Hapus modul |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/practicum` | Manajemen modul (Admin) |
| `/lecturer/practicum` | Manajemen modul (Dosen) |
| `/student/practicum` | Katalog & download modul (Mahasiswa) |

## Validasi & Business Rules

1. **Subjects** disimpan dalam format Array string di database (JSON).
2. **File Path** mengacu pada lokasi file di storage server.
3. **Pencarian** dilakukan pada nama modul.

## Relasi dengan Fitur Lain

Fitur ini berdiri sendiri (standalone) dan tidak memiliki ketergantungan langsung dengan User Enrollment atau Kelas. Modul bersifat terbuka untuk semua user dengan role yang sesuai.
