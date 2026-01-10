# Autentikasi (Authentication)

## Deskripsi

Fitur autentikasi mengelola proses login, logout, dan manajemen sesi pengguna. Sistem menggunakan cookie-based session dengan JWT untuk menjaga keamanan dan persistensi login.

## Alur Autentikasi

### 1. Login

```
[User] Masukkan Email/NIM + Password
                ↓
        Validasi Kredensial
                ↓
    ┌─── Valid ───┬─── Invalid ───┐
    ↓             ↓               ↓
Check Status   Error         (Kembali ke form)
    ↓
    ├── Active → Buat Session Cookie → Redirect ke Dashboard
    ├── Pending → Error: "Akun menunggu validasi"
    └── Rejected → Error: "Akun ditolak"
```

### 2. Logout

```
[User] Klik Logout
        ↓
Hapus Session Cookie
        ↓
Redirect ke Homepage
```

### 3. Session Check (Middleware)

```
[Setiap Request ke Protected Route]
        ↓
Cek Session Cookie
        ↓
    ┌── Ada & Valid ──┬── Tidak Ada / Expired ──┐
    ↓                 ↓                         ↓
  Lanjutkan      Redirect ke /login         (Unauthorized)
```

## Session Management

### Cookie Structure

| Property | Value |
|----------|-------|
| Name | `session` |
| HTTP Only | Yes (tidak bisa diakses JavaScript) |
| Secure | Yes (hanya HTTPS di production) |
| SameSite | Strict |
| Max Age | 24 jam |

### Session Data

```typescript
interface Session {
    user: {
        id: number;
        fullName: string;
        email: string;
        role: string;
        roleId: number;
    }
}
```

## Protected Routes

### Middleware Configuration

```typescript
// middleware.ts
const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
const isStudentRoute = request.nextUrl.pathname.startsWith('/student');
const isLecturerRoute = request.nextUrl.pathname.startsWith('/lecturer');

// Role-based access control
if (isAdminRoute && role !== 'Admin') redirect('/dashboard');
if (isStudentRoute && role !== 'Mahasiswa') redirect('/dashboard');
if (isLecturerRoute && role !== 'Dosen') redirect('/dashboard');
```

### Route Access Matrix

| Route | Admin | Dosen | Mahasiswa | Public |
|-------|-------|-------|-----------|--------|
| `/` | ✓ | ✓ | ✓ | ✓ |
| `/login` | ✓ | ✓ | ✓ | ✓ |
| `/register` | ✓ | ✓ | ✓ | ✓ |
| `/publications` | ✓ | ✓ | ✓ | ✓ |
| `/items/[qrCode]` | ✓ | ✓ | ✓ | ✓ |
| `/dashboard` | ✓ | ✓ | ✓ | ✗ |
| `/admin/*` | ✓ | ✗ | ✗ | ✗ |
| `/lecturer/*` | ✗ | ✓ | ✗ | ✗ |
| `/student/*` | ✗ | ✗ | ✓ | ✗ |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `login()` | `features/auth/actions.ts` | Proses login |
| `logout()` | `features/auth/actions.ts` | Proses logout |
| `getSession()` | `lib/auth.ts` | Ambil session saat ini |
| `requireAdmin()` | `lib/auth.ts` | Guard untuk admin actions |
| `register()` | `features/auth/actions.ts` | Registrasi user baru |

## Security Helpers

```typescript
// lib/auth.ts

// Get current session (may be null)
export async function getSession() { ... }

// Require admin role (throws if not admin)
export async function requireAdmin() {
    const session = await getSession();
    if (!session || session.user.role !== 'Admin') {
        throw new Error('Unauthorized: Admin access required');
    }
    return session;
}
```

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/login` | Halaman login |
| `/register` | Halaman registrasi |
| `/dashboard` | Redirect berdasarkan role |

## Komponen UI

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `LogoutButton` | `components/layout/` | Tombol logout di sidebar |

## Validasi & Business Rules

1. **Login bisa dengan Email atau NIM/NIDN**
2. **Password dienkripsi dengan bcrypt** (saltRounds: 10)
3. **Session expired otomatis setelah 24 jam**
4. **User dengan status Pending/Rejected tidak bisa login**
5. **Middleware redirect ke halaman sesuai role**

## Redirect Logic

| Role | Setelah Login |
|------|---------------|
| Admin | `/admin/dashboard` |
| Dosen | `/lecturer/dashboard` |
| Mahasiswa | `/student/dashboard` |

| Kondisi | Redirect |
|---------|----------|
| Sudah login + akses `/login` | Dashboard sesuai role |
| Belum login + akses protected route | `/login` |
| Role tidak sesuai dengan route | Dashboard sesuai role |

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./users.md) | Status user menentukan akses login |
| Semua fitur | Session digunakan untuk identifikasi user |
| Server Actions | `requireAdmin()` digunakan untuk proteksi mutations |

