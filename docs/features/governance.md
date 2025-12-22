# Governance, Publikasi & Hero Photos

## Deskripsi

Fitur governance mengelola dokumen tata kelola laboratorium (SOP dan LPJ), publikasi jurnal/penelitian, serta foto kegiatan yang tampil di homepage.

---

## 1. SOP & LPJ (Dokumen Tata Kelola)

### Deskripsi

Admin dapat mengunggah dokumen Standar Operasional Prosedur (SOP) dan Laporan Pertanggungjawaban Bulanan (LPJ) untuk dokumentasi laboratorium.

### User Access

| Role | Akses |
|------|-------|
| **Admin** | Upload, edit, hapus dokumen |
| **Publik** | Lihat & download di homepage |

### Tipe Dokumen

| Tipe | Deskripsi |
|------|-----------|
| `SOP` | Standar Operasional Prosedur |
| `LPJ Bulanan` | Laporan Pertanggungjawaban |

### Data Model - `governance_docs`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID dokumen |
| adminId | INT (FK) | Admin pengunggah |
| title | VARCHAR(255) | Judul dokumen |
| filePath | VARCHAR(255) | Path file PDF |
| coverPath | VARCHAR(255) | Path gambar cover |
| type | ENUM | SOP, LPJ Bulanan |
| createdAt | DATETIME | Tanggal upload |

### Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getGovernanceDocs(type)` | `lib/actions/governance.ts` | Ambil dokumen per tipe |
| `createGovernanceDoc()` | `lib/actions/governance.ts` | Upload dokumen |
| `updateGovernanceDoc()` | `lib/actions/governance.ts` | Edit dokumen |
| `deleteGovernanceDoc()` | `lib/actions/governance.ts` | Hapus dokumen |

### Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/governance` (Tab SOP/LPJ) | Manajemen dokumen |
| Homepage (SOPSection) | Tampilan SOP untuk publik |

---

## 2. Publikasi (Jurnal & Penelitian)

### Deskripsi

Dosen dan Admin dapat mengunggah publikasi ilmiah (jurnal, paper, penelitian) yang ditampilkan di halaman publik. Sistem menghitung jumlah view untuk setiap publikasi.

### User Access

| Role | Akses |
|------|-------|
| **Admin** | Full CRUD |
| **Dosen** | Upload & hapus milik sendiri |
| **Publik** | Lihat & baca publikasi |

### Data Model - `publications`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID publikasi |
| uploaderId | INT (FK) | User pengunggah |
| authorName | VARCHAR(255) | Nama penulis |
| title | VARCHAR(255) | Judul publikasi |
| abstract | TEXT | Abstrak |
| filePath | VARCHAR(255) | Path file PDF (opsional) |
| link | VARCHAR(255) | Link eksternal (opsional) |
| viewCount | INT | Jumlah view |
| publishDate | DATETIME | Tanggal publikasi |
| createdAt | DATETIME | Tanggal upload |

### Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getPublications()` | `lib/actions/publication.ts` | Ambil semua publikasi |
| `getTopPublications(limit)` | `lib/actions/publication.ts` | Top publikasi (untuk homepage) |
| `createPublication()` | `lib/actions/publication.ts` | Upload publikasi |
| `deletePublication()` | `lib/actions/publication.ts` | Hapus publikasi |
| `incrementViewCount()` | `lib/actions/publication.ts` | Tambah view count |

### Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/publications` | Halaman publik semua publikasi |
| `/admin/publications` | Manajemen publikasi (admin) |
| `/lecturer/publications` | Manajemen publikasi (dosen) |
| Homepage (PublicationSection) | Top 3 publikasi |

---

## 3. Hero Photos (Foto Kegiatan)

### Deskripsi

Admin dapat mengelola foto-foto kegiatan yang tampil sebagai carousel di homepage, memberikan kesan visual tentang aktivitas laboratorium.

### User Access

| Role | Akses |
|------|-------|
| **Admin** | Full CRUD |
| **Publik** | Lihat di homepage |

### Data Model - `hero_photos`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID foto |
| title | VARCHAR(255) | Judul/caption |
| description | TEXT | Deskripsi |
| imageUrl | TEXT | URL gambar |
| link | TEXT | Link opsional (klik untuk detail) |
| createdAt | DATETIME | Tanggal upload |

### Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getHeroPhotos()` | `lib/actions/hero-photo.ts` | Ambil semua foto |
| `addHeroPhoto()` | `lib/actions/hero-photo.ts` | Tambah foto |
| `updateHeroPhoto()` | `lib/actions/hero-photo.ts` | Edit foto |
| `deleteHeroPhoto()` | `lib/actions/hero-photo.ts` | Hapus foto |

### Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/hero-photos` | Manajemen foto kegiatan |
| Homepage (HeroCarousel) | Carousel foto |

---

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./user-management.md) | Admin sebagai pengunggah dokumen/foto, Dosen sebagai author publikasi |
| [Academic](./academic-practicum.md) | Publikasi bisa terkait hasil praktikum |
| Homepage | Semua konten governance tampil di homepage |
