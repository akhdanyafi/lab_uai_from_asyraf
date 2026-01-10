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
| programStudi | VARCHAR | Program studi |
| dosenPembimbing | VARCHAR | Dosen pembimbing |
| createdAt | DATETIME | Waktu pembuatan akun |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getUsers()` | `features/users/actions.ts` | Ambil semua pengguna (Admin) |
| `getRoles()` | `features/users/actions.ts` | Ambil daftar role (Admin) |
| `createUser()` | `features/users/actions.ts` | Buat pengguna baru (Admin) |
| `updateUser()` | `features/users/actions.ts` | Update data pengguna (Admin) |
| `deleteUser()` | `features/users/actions.ts` | Hapus pengguna (Admin) |
| `getPendingUsers()` | `features/users/actions.ts` | Ambil pengguna pending |
| `updateUserStatus()` | `features/users/actions.ts` | Validasi/tolak akun |
| `updateUserProfile()` | `features/users/actions.ts` | Update profil sendiri |

## Security

Semua action user management dilindungi dengan `requireAdmin()`:
- `getUsers`, `getRoles`, `createUser`, `updateUser`, `deleteUser`

Fungsi `updateUserProfile()` menggunakan `getSession()` untuk memastikan user hanya bisa update profil sendiri.

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/register` | Halaman registrasi mandiri |
| `/admin/governance` (Tab Users) | Manajemen pengguna oleh admin |
| `/admin/validations` (Tab Validasi User) | Validasi akun pending |
| `/*/profile` | Halaman profil per role |

## Validasi & Business Rules

1. **Email dan NIM/NIDN harus unik** - Tidak boleh duplikat
2. **Password minimal 6 karakter** - Dienkripsi dengan bcrypt
3. **Login bisa dengan Email atau NIM** - Fleksibilitas login
4. **Mahasiswa wajib isi batch dan studyType** - Untuk pengelompokan kelas
5. **Admin tidak bisa menghapus diri sendiri** - Pencegahan self-deletion

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [Peminjaman Alat](./loans.md) | User sebagai peminjam (`studentId`) dan validator (`validatorId`) |
| [Pemesanan Ruangan](./bookings.md) | User sebagai pemesan (`userId`) dan validator (`validatorId`) |
| [Praktikum](./practicum.md) | User sebagai dosen (`lecturerId`) dan mahasiswa (`studentId`) |
| [Governance](./governance.md) | User sebagai admin pengunggah dokumen |

