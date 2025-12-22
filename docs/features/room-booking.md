# Pemesanan Ruangan (Room Booking)

## Deskripsi

Fitur pemesanan ruangan memungkinkan mahasiswa dan dosen untuk memesan ruangan laboratorium untuk kegiatan tertentu. Setiap pemesanan memerlukan validasi dari admin sebelum dikonfirmasi.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Kelola ruangan, validasi pemesanan, lihat kalender |
| **Dosen** | Ajukan pemesanan, lihat pemesanan saya |
| **Mahasiswa** | Ajukan pemesanan, lihat pemesanan saya |

## Alur Proses Pemesanan

```
[User] Pilih Ruangan & Waktu → Isi Keperluan → Submit
                                    ↓
                          Status: "Pending"
                                    ↓
                          [Admin] Validasi
                                    ↓
            ┌────── Disetujui ──────┬────── Ditolak ──────┐
            ↓                       ↓                     ↓
    Status: "Disetujui"      Status: "Ditolak"       (Selesai)
    (Tampil di kalender)     (Tidak tampil)
```

## Status Pemesanan

| Status | Deskripsi | Tampil di Kalender |
|--------|-----------|---------------------|
| `Pending` | Menunggu validasi | Tidak |
| `Disetujui` | Pemesanan dikonfirmasi | Ya |
| `Ditolak` | Pemesanan ditolak | Tidak |

## Status Ruangan

| Status | Deskripsi |
|--------|-----------|
| `Tersedia` | Ruangan bisa dipesan |
| `Maintenance` | Dalam perbaikan, tidak tersedia |

## Data Model

### Tabel `rooms`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID ruangan |
| name | VARCHAR(100) | Nama ruangan |
| location | VARCHAR(255) | Lokasi (gedung/lantai) |
| capacity | INT | Kapasitas ruangan |
| status | ENUM | Tersedia, Maintenance |

### Tabel `room_bookings`

| Kolom | Tipe | Deskripsi |
|-------|------|-----------|
| id | INT (PK) | ID pemesanan |
| userId | INT (FK) | User yang memesan |
| roomId | INT (FK) | Ruangan yang dipesan |
| validatorId | INT (FK) | Admin yang validasi |
| startTime | DATETIME | Waktu mulai |
| endTime | DATETIME | Waktu selesai |
| purpose | TEXT | Keperluan/alasan pemesanan |
| status | ENUM | Pending, Disetujui, Ditolak |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getAllRooms()` | `lib/actions/booking.ts` | Ambil semua ruangan |
| `getMonthBookings()` | `lib/actions/booking.ts` | Booking per bulan (kalender) |
| `getMyBookings()` | `lib/actions/booking.ts` | Pemesanan milik saya |
| `createRoomBooking()` | `lib/actions/booking.ts` | Ajukan pemesanan |
| `getBookingRequests()` | `lib/actions/booking.ts` | Semua permintaan (admin) |
| `updateBookingStatus()` | `lib/actions/booking.ts` | Validasi pemesanan |
| `getMaintenanceRooms()` | `lib/actions/booking.ts` | Ruangan maintenance |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/validations` (Tab Ruangan) | Validasi permintaan pemesanan |
| `/student/rooms` | Kalender + form pemesanan |
| `/lecturer/rooms` | Kalender + form pemesanan |
| Homepage | Kalender ruangan publik |

## Komponen UI

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `CalendarView` | `components/shared/` | Tampilan kalender interaktif |
| `RoomBookingClient` | `components/rooms/` | Form pemesanan ruangan |
| `HomeCalendar` | `app/(home)/_components/` | Kalender homepage (view only) |

## Validasi & Business Rules

1. **Tidak boleh double booking** - Waktu tidak boleh overlap untuk ruangan yang sama
2. **End time harus setelah start time**
3. **Ruangan Maintenance tidak bisa dipesan**
4. **Hanya booking dengan status Disetujui yang tampil di kalender**

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./user-management.md) | User sebagai pemesan dan validator |
| [Inventory](./inventory-loan.md) | Ruangan menyimpan alat (items.roomId) |
| Homepage | Ruangan maintenance tampil di pengumuman |
