# Portal Akademik & Praktikum

## Deskripsi

Fitur akademik mengelola seluruh aktivitas praktikum laboratorium, mencakup pengelolaan mata kuliah, kelas, modul, sesi praktikum, hingga pengumpulan dan penilaian laporan mahasiswa.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Kelola courses, classes, modules, sessions, enrollment |
| **Dosen** | Kelola sessions untuk kelas yang diampu, penilaian laporan |
| **Mahasiswa** | Lihat sesi, download modul, upload laporan |

## Hierarki Data

```
Course (Mata Kuliah)
    ↓ 1:N
Class (Kelas)
    ├── 1:N → ClassEnrollment (Peserta)
    │              ↓
    │         Student (Mahasiswa)
    │
    └── 1:N → PracticalSession (Sesi Praktikum)
                   ↓
              Module (Modul)
                   ↓ 1:N
              PracticalReport (Laporan)
                   ↓
              Student (Mahasiswa)
```

## Alur Proses Praktikum

### 1. Setup Praktikum (Admin/Dosen)

```
[Admin] Buat Course (Mata Kuliah)
            ↓
[Admin] Buat Class + Assign Dosen
            ↓
[Admin/Dosen] Upload Modul ke Course
            ↓
[Admin/Dosen] Buat Session (Sesi Praktikum)
    - Pilih Class
    - Pilih Modul
    - Set tanggal mulai & deadline
            ↓
[Admin/Dosen] Enroll Mahasiswa ke Class
```

### 2. Aktivitas Mahasiswa

```
[Mahasiswa] Lihat Daftar Sesi Aktif
            ↓
[Mahasiswa] Download Modul PDF
            ↓
[Mahasiswa] Kerjakan Praktikum
            ↓
[Mahasiswa] Upload Laporan (sebelum deadline)
            ↓
    Session: isOpen = true?
        ├── Yes → Upload berhasil
        └── No  → Ditolak (sesi ditutup)
```

### 3. Penilaian (Dosen)

```
[Dosen] Lihat Laporan yang Masuk
            ↓
[Dosen] Download Laporan
            ↓
[Dosen] Input Nilai (0-100) + Feedback
            ↓
[Mahasiswa] Lihat Nilai
```

## Data Model

### Tabel `courses` (Mata Kuliah)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID mata kuliah |
| code | VARCHAR(20) | Kode MK (IF123) |
| name | VARCHAR(100) | Nama mata kuliah |
| description | TEXT | Deskripsi |

### Tabel `classes` (Kelas)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID kelas |
| courseId | INT (FK) | Mata kuliah |
| lecturerId | INT (FK) | Dosen pengampu |
| name | VARCHAR(50) | Nama kelas (IF-22A) |
| semester | VARCHAR(50) | Semester (Ganjil 2024/2025) |

### Tabel `class_enrollments` (Peserta Kelas)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID enrollment |
| classId | INT (FK) | Kelas |
| studentId | INT (FK) | Mahasiswa peserta |

### Tabel `modules` (Modul)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID modul |
| courseId | INT (FK) | Mata kuliah pemilik |
| title | VARCHAR(255) | Judul modul |
| description | TEXT | Deskripsi |
| filePath | VARCHAR(255) | Path file PDF |
| order | INT | Urutan modul |
| createdAt | DATETIME | Tanggal dibuat |

### Tabel `practical_sessions` (Sesi Praktikum)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID sesi |
| classId | INT (FK) | Kelas target |
| moduleId | INT (FK) | Modul yang dikerjakan |
| startDate | DATETIME | Tanggal mulai |
| deadline | DATETIME | Batas pengumpulan |
| isOpen | BOOLEAN | Sesi masih terbuka |

### Tabel `practical_reports` (Laporan)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID laporan |
| sessionId | INT (FK) | Sesi praktikum |
| studentId | INT (FK) | Mahasiswa pengirim |
| filePath | VARCHAR(255) | Path file laporan |
| submissionDate | DATETIME | Tanggal kirim |
| grade | INT | Nilai (0-100) |
| feedback | TEXT | Komentar/feedback dosen |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getCourses()` | `lib/actions/academic.ts` | Daftar mata kuliah |
| `getClasses()` | `lib/actions/academic.ts` | Daftar kelas |
| `getModulesByCourse()` | `lib/actions/academic.ts` | Modul per mata kuliah |
| `createCourse()` | `lib/actions/academic.ts` | Buat mata kuliah |
| `createClass()` | `lib/actions/academic.ts` | Buat kelas |
| `createModule()` | `lib/actions/academic.ts` | Upload modul |
| `createSession()` | `lib/actions/practicum.ts` | Buat sesi praktikum |
| `getSessionById()` | `lib/actions/practicum.ts` | Detail sesi |
| `submitReport()` | `lib/actions/practicum.ts` | Upload laporan |
| `updateGrade()` | `lib/actions/practicum.ts` | Beri nilai |
| `enrollStudents()` | `lib/actions/academic.ts` | Daftarkan peserta |

## Halaman Terkait

### Admin

| Route | Deskripsi |
|-------|-----------|
| `/admin/academic/create` | Buat course, class, module |
| `/admin/practicum` | Dashboard manajemen praktikum |
| `/admin/practicum/create` | Buat sesi praktikum |
| `/admin/practicum/[id]` | Detail sesi + penilaian |

### Dosen

| Route | Deskripsi |
|-------|-----------|
| `/lecturer/practicum` | Dashboard praktikum dosen |
| `/lecturer/practicum/create` | Buat sesi untuk kelas yang diampu |
| `/lecturer/sessions/[id]` | Detail sesi + penilaian |
| `/lecturer/classes/[classId]` | Detail kelas |

### Mahasiswa

| Route | Deskripsi |
|-------|-----------|
| `/student/sessions` | Daftar sesi praktikum saya |
| `/student/sessions/[sessionId]` | Detail sesi + upload laporan |

## Validasi & Business Rules

1. **Satu laporan per mahasiswa per sesi** - Tidak bisa submit ulang
2. **Upload hanya saat sesi terbuka (isOpen = true)**
3. **Nilai 0-100**
4. **Modul terikat ke Course, bukan Class** - Reusable antar kelas
5. **Mahasiswa hanya lihat sesi untuk kelas yang di-enroll**

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./user-management.md) | Dosen sebagai pengampu, Mahasiswa sebagai peserta |
| [Publications](./governance.md#publikasi) | Dosen bisa publish jurnal dari hasil praktikum |
