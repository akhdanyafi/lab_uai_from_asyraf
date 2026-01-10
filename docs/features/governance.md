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
| `getGovernanceDocs(type)` | `features/governance/actions.ts` | Ambil dokumen per tipe |
| `createGovernanceDoc()` | `features/governance/actions.ts` | Upload dokumen |
| `updateGovernanceDoc()` | `features/governance/actions.ts` | Edit dokumen |
| `deleteGovernanceDoc()` | `features/governance/actions.ts` | Hapus dokumen |

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
| `getPublications()` | `features/publications/actions.ts` | Ambil semua publikasi |
| `getTopPublications(limit)` | `features/publications/actions.ts` | Top publikasi (untuk homepage) |
| `createPublication()` | `features/publications/actions.ts` | Upload publikasi |
| `deletePublication()` | `features/publications/actions.ts` | Hapus publikasi |
| `incrementViewCount()` | `features/publications/actions.ts` | Tambah view count |

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
| `getHeroPhotos()` | `features/hero-photos/actions.ts` | Ambil semua foto |
| `addHeroPhoto()` | `features/hero-photos/actions.ts` | Tambah foto |
| `updateHeroPhoto()` | `features/hero-photos/actions.ts` | Edit foto |
| `deleteHeroPhoto()` | `features/hero-photos/actions.ts` | Hapus foto |

### Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/hero-photos` | Manajemen foto kegiatan |
| Homepage (HeroCarousel) | Carousel foto |

---

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./users.md) | Admin sebagai pengunggah dokumen/foto, Dosen sebagai author publikasi |
| [Practicum](./practicum.md) | Publikasi bisa terkait hasil praktikum |
| Homepage | Semua konten governance tampil di homepage |

