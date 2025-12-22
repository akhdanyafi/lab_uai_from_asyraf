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
| 1 | **User Management** | Registrasi, validasi akun, role management | [Detail →](./features/user-management.md) |
| 2 | **Inventory & Loans** | Katalog alat, peminjaman, pengembalian | [Detail →](./features/inventory-loan.md) |
| 3 | **Room Booking** | Pemesanan ruangan, kalender, validasi | [Detail →](./features/room-booking.md) |
| 4 | **Academic & Practicum** | Mata kuliah, kelas, modul, sesi, penilaian | [Detail →](./features/academic-practicum.md) |
| 5 | **Governance** | SOP, LPJ, Hero Photos, Publikasi | [Detail →](./features/governance.md) |
| 6 | **Authentication** | Login, logout, session, middleware | [Detail →](./features/authentication.md) |

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
│ Item Loans  │      │ Room         │      │ Classes      │
│             │      │ Bookings     │      │              │
│ studentId   │      │ userId       │      │ lecturerId   │
│ validatorId │      │ validatorId  │      │              │
└─────────────┘      └──────────────┘      └──────┬───────┘
                                                  │
                                                  ▼
                                           ┌──────────────┐
                                           │ Enrollments  │
                                           │              │
                                           │ studentId    │
                                           └──────────────┘
```

### Flow Data Praktikum

```
Course → Class → Session → Report
                    ↓
                  Module
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
Pending → Disetujui → Selesai
    └──→ Ditolak
```

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

| Fitur | Actions | Services | Validators |
|-------|---------|----------|------------|
| User Management | `user.ts` | `user.service.ts` | `user.validator.ts` |
| Inventory & Loans | `loan.ts`, `inventory.ts` | `loan.service.ts`, `inventory.service.ts` | `loan.validator.ts`, `inventory.validator.ts` |
| Room Booking | `booking.ts` | `booking.service.ts` | `booking.validator.ts` |
| Academic | `academic.ts`, `practicum.ts` | - | - |
| Governance | `governance.ts`, `publication.ts`, `hero-photo.ts` | `publication.service.ts`, `hero-photo.service.ts` | - |
| Authentication | `auth.ts`, `register.ts` | - | - |
