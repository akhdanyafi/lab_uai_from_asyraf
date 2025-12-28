# Portal Akademik & Praktikum (Simplified)

## Deskripsi

Fitur akademik mengelola aktivitas praktikum laboratorium dengan arsitektur yang **disederhanakan** untuk kemudahan penggunaan. Sistem ini menggunakan pendekatan "Lean Architecture" yang menghilangkan over-engineering dan memprioritaskan workflow yang efisien.

### Perubahan Arsitektur (vs Versi Sebelumnya)

| Sebelum | Sesudah | Alasan |
|---------|---------|--------|
| Tabel `courses` terpisah | Kolom `courseCode`, `courseName` di `classes` | Tidak perlu hierarki kompleks untuk lab kecil |
| Tabel `modules` terpisah | Kolom `title`, `description`, `filePath` di `assignments` | Dosen ingin "one-stop" workflow |
| Kolom `isOpen` (boolean) | Logic `NOW() <= deadline` | Menghindari cron job, status real-time |
| Admin input NIM manual | `enrollmentKey` utk self-enrollment | Mengurangi beban administratif |

## User Access

| Role | Akses |
|------|-------|
| **Admin** | CRUD classes, assignments, class enrollments |
| **Dosen** | Kelola assignments untuk kelas yang diampu, penilaian laporan |
| **Mahasiswa** | Lihat assignments, download soal, upload laporan, self-enroll via kode |

## Hierarki Data (Simplified)

```
Class (courseCode, courseName, enrollmentKey)
    ├── ClassEnrollment
    │       └── Student
    └── Assignment (title, description, filePath, deadline)
            └── PracticalReport
                    └── Student
```

## Alur Proses Praktikum

### 1. Setup Praktikum (Admin/Dosen)

```
[Admin/Dosen] Buat Class
    - Input: courseCode, courseName, className, semester, dosen
    - Output: enrollmentKey auto-generated (e.g., IF12-A-X9K2)
            ↓
[Admin/Dosen] Share enrollmentKey ke grup WhatsApp
            ↓
[Admin/Dosen] Buat Assignment (One-Stop Workflow)
    - Input: title, description, upload PDF soal, deadline
    - Tidak perlu buat "Bank Soal" terlebih dahulu
```

### 2. Self-Enrollment Mahasiswa (NEW!)

```
[Dosen] Share enrollmentKey ke mahasiswa
            ↓
[Mahasiswa] Login → Masukkan enrollmentKey
            ↓
[Sistem] Validasi key → Mahasiswa tercatat di class_enrollments
            ↓
[Mahasiswa] Otomatis melihat assignments kelas tersebut
```

### 3. Aktivitas Mahasiswa

```
[Mahasiswa] Lihat Daftar Assignment Aktif
            ↓
[Mahasiswa] Download PDF Soal
            ↓
[Mahasiswa] Kerjakan Praktikum
            ↓
[Mahasiswa] Upload Laporan
            ↓
    Validasi: NOW() <= deadline?
        ├── Yes → Upload berhasil
        └── No  → Ditolak "Deadline sudah lewat"
```

### 4. Penilaian (Dosen)

```
[Dosen] Lihat Laporan yang Masuk
            ↓
[Dosen] Download Laporan
            ↓
[Dosen] Input Nilai (0-100) + Feedback
            ↓
[Mahasiswa] Lihat Nilai
```

## Data Model (Simplified)

### Tabel `classes` (Kelas + Info Mata Kuliah)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID kelas |
| lecturerId | INT (FK) | Dosen pengampu |
| courseCode | VARCHAR(20) | Kode MK (IF123) |
| courseName | VARCHAR(100) | Nama mata kuliah |
| name | VARCHAR(50) | Nama kelas (IF-22A) |
| semester | VARCHAR(50) | Semester (Ganjil 2024/2025) |
| enrollmentKey | VARCHAR(50) | Kode untuk self-enrollment (UNIQUE) |

### Tabel `class_enrollments` (Peserta Kelas)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID enrollment |
| classId | INT (FK) | Kelas |
| studentId | INT (FK) | Mahasiswa peserta |
| enrolledAt | DATETIME | Waktu enrollment |

### Tabel `assignments` (Tugas Praktikum)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID assignment |
| classId | INT (FK) | Kelas target |
| title | VARCHAR(255) | Judul tugas (Praktikum 1 - TCP/IP) |
| description | TEXT | Deskripsi tugas |
| filePath | VARCHAR(255) | Path file PDF soal |
| order | INT | Urutan tugas |
| startDate | DATETIME | Tanggal mulai |
| deadline | DATETIME | Batas pengumpulan |
| createdAt | DATETIME | Tanggal dibuat |

> **Note**: Kolom `isOpen` dihapus. Status buka/tutup dihitung real-time: `NOW() <= deadline`

### Tabel `practical_reports` (Laporan)

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID laporan |
| assignmentId | INT (FK) | Assignment terkait |
| studentId | INT (FK) | Mahasiswa pengirim |
| filePath | VARCHAR(255) | Path file laporan |
| submissionDate | DATETIME | Tanggal kirim |
| grade | INT | Nilai (0-100) |
| feedback | TEXT | Komentar dosen |

## Server Actions

### Class Management

| Action | Deskripsi |
|--------|-----------|
| `getClasses()` | Daftar semua kelas |
| `createClass()` | Buat kelas (auto-generate enrollmentKey) |
| `updateClass()` | Update info kelas |
| `deleteClass()` | Hapus kelas |
| `getClassById()` | Detail kelas |

### Enrollment Key System (NEW!)

| Action | Deskripsi |
|--------|-----------|
| `regenerateEnrollmentKey()` | Generate ulang kode enrollment |
| `validateEnrollmentKey()` | Validasi kode |
| `enrollWithKey()` | Mahasiswa enroll sendiri dengan kode |

### Assignment Management

| Action | Deskripsi |
|--------|-----------|
| `getAssignments()` | Daftar semua assignment |
| `createAssignment()` | Buat assignment (one-stop: title + desc + file + deadline) |
| `updateAssignment()` | Update assignment |
| `deleteAssignment()` | Hapus assignment |
| `getAssignmentById()` | Detail assignment + reports |

### Student & Grading

| Action | Deskripsi |
|--------|-----------|
| `getStudentAssignments()` | Tugas untuk mahasiswa yang enrolled |
| `submitReport()` | Upload laporan (validasi deadline) |
| `updateGrade()` | Beri nilai + feedback |

### Class Enrollments

| Action | Deskripsi |
|--------|-----------|
| `getClassMembers()` | Daftar anggota kelas |
| `enrollStudent()` | Admin enroll manual |
| `unenrollStudent()` | Keluarkan mahasiswa |
| `bulkEnrollStudents()` | Enroll banyak mahasiswa |
| `searchStudents()` | Cari mahasiswa untuk enroll |

## Halaman Terkait

### Admin

| Route | Deskripsi |
|-------|-----------|
| `/admin/practicum` | Dashboard manajemen praktikum |
| `/admin/practicum/create` | Buat kelas baru |
| `/admin/practicum/[id]` | Detail kelas + assignments |

### Dosen

| Route | Deskripsi |
|-------|-----------|
| `/lecturer/practicum` | Dashboard praktikum dosen |
| `/lecturer/practicum/create` | Buat assignment |
| `/lecturer/sessions/[id]` | Detail assignment + penilaian |

### Mahasiswa

| Route | Deskripsi |
|-------|-----------|
| `/student/enroll` | Input enrollment key (NEW!) |
| `/student/assignments` | Daftar tugas saya |
| `/student/assignments/[id]` | Detail tugas + upload laporan |

## Validasi & Business Rules

1. **Satu laporan per mahasiswa per assignment** - Tidak bisa submit ulang
2. **Upload hanya jika `NOW() <= deadline`** - Logic real-time
3. **Nilai 0-100**
4. **Enrollment key harus valid dan unik**
5. **Mahasiswa tidak bisa enroll 2x ke kelas yang sama**
6. **Mahasiswa hanya lihat assignments untuk kelas yang di-enroll**

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./user-management.md) | Dosen sebagai pengampu, Mahasiswa sebagai peserta |
| [Publications](./governance.md#publikasi) | Dosen bisa publish jurnal dari hasil praktikum |
