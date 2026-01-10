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
| organisasi | VARCHAR | Organisasi pemohon |
| jumlahPeserta | INT | Jumlah peserta |
| suratPermohonan | VARCHAR | Path surat permohonan |
| dosenPembimbing | VARCHAR | Nama dosen pembimbing |
| status | ENUM | Pending, Disetujui, Ditolak |

## Server Actions

| Action | File | Deskripsi |
|--------|------|-----------|
| `getAllRooms()` | `features/bookings/actions.ts` | Ambil semua ruangan |
| `getMonthBookings()` | `features/bookings/actions.ts` | Booking per bulan (kalender) |
| `getMyBookings()` | `features/bookings/actions.ts` | Pemesanan milik saya |
| `createRoomBooking()` | `features/bookings/actions.ts` | Ajukan pemesanan |
| `getBookingRequests()` | `features/bookings/actions.ts` | Semua permintaan (Admin) |
| `updateBookingStatus()` | `features/bookings/actions.ts` | Validasi pemesanan (Admin) |
| `deleteBooking()` | `features/bookings/actions.ts` | Hapus booking (Admin) |
| `getMaintenanceRooms()` | `features/bookings/actions.ts` | Ruangan maintenance |

## Security

Semua action admin dilindungi dengan `requireAdmin()`:
- `getBookingRequests`, `updateBookingStatus`, `deleteBooking`

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/validations` (Tab Ruangan) | Validasi permintaan pemesanan |
| `/admin/validations` (Tab Riwayat) | Riwayat booking selesai |
| `/student/rooms` | Kalender + form pemesanan |
| `/lecturer/rooms` | Kalender + form pemesanan |
| Homepage | Kalender ruangan publik |

## Komponen UI

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| `CalendarView` | `components/shared/` | Tampilan kalender interaktif |
| `RoomBookingClient` | `features/bookings/components/` | Form pemesanan ruangan |
| `HomeCalendar` | `app/(home)/_components/` | Kalender homepage (view only) |

## Validasi & Business Rules

1. **Tidak boleh double booking** - Waktu tidak boleh overlap untuk ruangan yang sama
2. **End time harus setelah start time**
3. **Ruangan Maintenance tidak bisa dipesan**
4. **Hanya booking dengan status Disetujui yang tampil di kalender**
5. **Booking dengan surat permohonan** bisa auto-approve

## Relasi dengan Fitur Lain

| Fitur | Relasi |
|-------|--------|
| [User Management](./users.md) | User sebagai pemesan dan validator |
| [Inventory](./inventory.md) | Ruangan menyimpan alat (items.roomId) |
| Homepage | Ruangan maintenance tampil di pengumuman |

