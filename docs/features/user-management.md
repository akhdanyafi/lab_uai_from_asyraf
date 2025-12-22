# Manajemen Pengguna (User Management)

## Deskripsi

Fitur manajemen pengguna mengatur seluruh siklus hidup akun pengguna dalam sistem LAB_UAI, mulai dari registrasi, validasi akun, pengelolaan role, hingga penghapusan akun.

## Role Pengguna

| Role | Deskripsi | Identifier |
|------|-----------|------------|
| **Admin** | Pengelola sistem dengan akses penuh | Email |
| **Dosen** | Pengajar yang mengelola praktikum | NIDN |
| **Mahasiswa** | Peserta praktikum dan peminjam alat | NIM |

## Alur Proses

### 1. Registrasi Mahasiswa (Self-Registration)

```
[Calon User] → Isi Form Registrasi → Status: Pending
                     ↓
             [Admin] Validasi
                     ↓
        ┌──── Disetujui ────┐
        ↓                   ↓
   Status: Active      Status: Rejected
   (Bisa login)        (Tidak bisa login)
```

### 2. Pembuatan Akun oleh Admin

```
[Admin] → Form User Baru → Langsung Status: Active
```

### 3. Transisi Status Akun

| Status | Deskripsi | Akses |
|--------|-----------|-------|
| `Pending` | Menunggu validasi admin | Tidak bisa login |
| `Active` | Akun aktif dan terverifikasi | Bisa login |
| `Rejected` | Ditolak oleh admin | Tidak bisa login |

## Data Model

### Tabel `roles`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID unik role |
| name | VARCHAR(50) | Nama role (Admin, Mahasiswa, Dosen) |

### Tabel `users`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID unik pengguna |
| roleId | INT (FK) | Referensi ke tabel roles |
| fullName | VARCHAR(255) | Nama lengkap |
| identifier | VARCHAR(50) | NIM/NIDN (unik) |
| email | VARCHAR(255) | Email (unik) |
| passwordHash | VARCHAR(255) | Hash password (bcrypt) |
| status | ENUM | Pending, Active, Rejected |
| batch | INT | Angkatan (khusus mahasiswa) |
| studyType | ENUM | Reguler atau Hybrid |
| createdAt | DATETIME | Waktu pembuatan akun |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getUsers()` | `lib/actions/user.ts` | Ambil semua pengguna |
| `getRoles()` | `lib/actions/user.ts` | Ambil daftar role |
| `createUser()` | `lib/actions/user.ts` | Buat pengguna baru |
| `updateUser()` | `lib/actions/user.ts` | Update data pengguna |
| `deleteUser()` | `lib/actions/user.ts` | Hapus pengguna |
| `getPendingUsers()` | `lib/actions/user.ts` | Ambil pengguna pending |
| `updateUserStatus()` | `lib/actions/user.ts` | Validasi/tolak akun |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/register` | Halaman registrasi mandiri |
| `/admin/governance` (Tab Users) | Manajemen pengguna oleh admin |
| `/admin/validations` (Tab Akun) | Validasi akun pending |

## Validasi & Business Rules

1. **Email dan NIM/NIDN harus unik** - Tidak boleh duplikat
2. **Password minimal 6 karakter** - Dienkripsi dengan bcrypt
3. **Login bisa dengan Email atau NIM** - Fleksibilitas login
4. **Mahasiswa wajib isi batch dan studyType** - Untuk pengelompokan kelas

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [Peminjaman Alat](./inventory-loan.md) | User sebagai peminjam (`studentId`) dan validator (`validatorId`) |
| [Pemesanan Ruangan](./room-booking.md) | User sebagai pemesan (`userId`) dan validator (`validatorId`) |
| [Praktikum](./academic-practicum.md) | User sebagai dosen (`lecturerId`) dan mahasiswa (`studentId`) |
| [Governance](./governance.md) | User sebagai admin pengunggah dokumen |
