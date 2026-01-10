# Features & Capabilities

Dokumentasi lengkap fitur-fitur sistem LAB_UAI (Laboratorium Informatika Universitas Al Azhar Indonesia).

## Arsitektur Fitur

```
┌─────────────────────────────────────────────────────────────────┐
│                         HOMEPAGE                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Hero     │ │ SOP      │ │ Publikasi│ │ Kalender Ruangan │   │
│  │ Carousel │ │ Section  │ │ Section  │ │ + Pengumuman     │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────────┬─────────┘   │
└───────┼────────────┼────────────┼────────────────┼─────────────┘
        │            │            │                │
        ▼            ▼            ▼                ▼
┌──────────────┐ ┌─────────────────────────┐ ┌────────────┐
│ Governance   │ │ Publications            │ │ Bookings   │
│ (Hero Photos,│ │ (Jurnal, Penelitian)    │ │ (Ruangan)  │
│  SOP, LPJ)   │ │                         │ │            │
└──────┬───────┘ └───────────┬─────────────┘ └──────┬─────┘
       │                     │                      │
       └─────────────────────┼──────────────────────┘
                             │
                             ▼
                    ┌────────────────┐
                    │ User Management │
                    │ (Admin, Dosen,  │
                    │  Mahasiswa)     │
                    └───────┬────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌──────────────┐   ┌────────────────┐   ┌──────────────┐
│ Inventory &  │   │ Academic &     │   │ Room         │
│ Item Loans   │   │ Practicum      │   │ Booking      │
│              │   │                │   │              │
│ (Peminjaman  │   │ (Praktikum,    │   │ (Pemesanan   │
│  Alat)       │   │  Modul, Nilai) │   │  Ruangan)    │
└──────────────┘   └────────────────┘   └──────────────┘
```

## Daftar Fitur

| # | Fitur | Deskripsi | Dokumentasi |
|---|-------|-----------|-------------|
| 1 | **User Management** | Registrasi, validasi akun, role management | [Detail →](./features/users.md) |
| 2 | **Inventory** | Katalog alat, kategori, ruangan | [Detail →](./features/inventory.md) |
| 3 | **Item Loans** | Peminjaman alat, pengembalian | [Detail →](./features/loans.md) |
| 4 | **Room Booking** | Pemesanan ruangan, kalender, validasi | [Detail →](./features/bookings.md) |
| 5 | **Practicum** | Modul praktikum, upload/download | [Detail →](./features/practicum.md) |
| 6 | **Governance** | SOP, LPJ, Hero Photos, Publikasi | [Detail →](./features/governance.md) |
| 7 | **Authentication** | Login, logout, session, middleware | [Detail →](./features/auth.md) |

## User Roles

| Role | Akses Utama |
|------|-------------|
| **Admin** | Full access ke semua fitur |
| **Dosen** | Praktikum, publikasi, pemesanan ruangan |
| **Mahasiswa** | Peminjaman alat, praktikum, pemesanan ruangan |

## Relasi Antar Fitur

### User sebagai Pusat

```
                    ┌─────────────────┐
                    │      USER       │
                    │                 │
                    │  - id           │
                    │  - roleId       │
                    │  - fullName     │
                    │  - identifier   │
                    └────────┬────────┘
                             │
     ┌───────────────────────┼───────────────────────┐
     │                       │                       │
     ▼                       ▼                       ▼
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│ Item Loans  │      │ Room         │      │ Publications │
│             │      │ Bookings     │      │              │
│ studentId   │      │ userId       │      │ uploaderId   │
│ validatorId │      │ validatorId  │      │              │
└─────────────┘      └──────────────┘      └──────────────┘

### Flow Data Praktikum

```
Admin/Dosen Upload PDF → Mahasiswa Download & Belajar
       (Module)
```

### Item & Room Relationship

```
Room ─────┬───── Items (penyimpanan)
          │
          └───── Bookings (pemesanan)
```

## Status Matrix

### Item Loan Status Flow

```
                  ┌─────────────────────────────────────────────┐
                  │              LOAN STATUS                    │
                  │ Pending → Disetujui → Ditolak               │
                  └─────────────────┬───────────────────────────┘
                                    │ (If Disetujui)
                                    ▼
                  ┌─────────────────────────────────────────────┐
                  │            RETURN STATUS                    │
                  │ - → Pending → Dikembalikan / Ditolak        │
                  └─────────────────────────────────────────────┘
```
- **Loan Status**: `Pending` → `Disetujui` / `Ditolak`
- **Return Status**: `-` → `Pending` (student requests return) → `Dikembalikan` (admin approves) / `Ditolak`

### Room Booking Status Flow

```
Pending → Disetujui
    └──→ Ditolak
```

### User Account Status Flow

```
Pending → Active
    └──→ Rejected
```

## Tech Stack per Fitur

| Fitur | Location | Files |
|-------|----------|-------|
| **User Management** | `features/users/` | `actions.ts`, `service.ts` |
| **Inventory** | `features/inventory/` | `actions.ts`, `service.ts` |
| **Loans** | `features/loans/` | `actions.ts`, `service.ts` |
| **Room Booking** | `features/bookings/` | `actions.ts`, `service.ts`, `validator.ts` |
| **Academic/Practicum** | `features/practicum/` | `actions.ts`, `service.ts` |
| **Governance** | `features/governance/` | `actions.ts`, components |
| **Publications** | `features/publications/` | `actions.ts`, `service.ts` |
| **Hero Photos** | `features/hero-photos/` | `actions.ts`, `service.ts` |
| **Authentication** | `features/auth/` | `actions.ts` |

## Security Model

All administrative Server Actions are protected with **Role-Based Access Control (RBAC)**:

```typescript
// lib/auth.ts
export async function requireAdmin() {
    const session = await getSession();
    if (!session || session.user.role !== 'Admin') {
        throw new Error('Unauthorized: Admin access required');
    }
    return session;
}
```

Protected actions include:
- All Inventory mutations (create, update, delete)
- All User management actions
- Loan/Booking approval/rejection
- History deletion

