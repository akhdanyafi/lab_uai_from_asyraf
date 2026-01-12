# Dashboard

## Deskripsi

Dashboard adalah halaman utama yang menampilkan ringkasan statistik dan aktivitas terbaru berdasarkan role pengguna. Setiap role memiliki tampilan dashboard yang berbeda sesuai kebutuhan aksesnya.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Statistik lengkap, notifikasi, insights, dan analytics |
| **Dosen** | Booking ruangan mendatang |
| **Mahasiswa** | Pinjaman aktif, booking mendatang, request pending |

## Fitur per Role

### 1. Admin Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                            │
├───────────────────────────────────────────────────────────────┤
│  📊 Statistik Utama                                            │
│  ├── Total Alat                                                │
│  ├── Pinjaman Aktif                                            │
│  ├── Pending Pinjaman                                          │
│  ├── Pending Booking                                           │
│  └── Pending Pengembalian                                      │
├───────────────────────────────────────────────────────────────┤
│  🔔 Notifikasi Auto-Approved                                   │
│  ├── Pinjaman dengan Surat Izin (auto-approved)               │
│  ├── Booking dengan Surat Permohonan (auto-approved)          │
│  └── Pengembalian dengan Foto Bukti (auto-returned)           │
├───────────────────────────────────────────────────────────────┤
│  📈 Analytics & Charts                                         │
│  ├── Tren Peminjaman (7 hari terakhir)                        │
│  ├── Booking per Ruangan                                       │
│  └── Pinjaman per Kategori                                     │
├───────────────────────────────────────────────────────────────┤
│  💡 Insights                                                    │
│  ├── Tren naik/turun peminjaman                                │
│  ├── Item menunggu validasi                                    │
│  ├── Alat tidak aktif (>60 hari)                               │
│  ├── Jam sibuk booking                                         │
│  └── Publikasi pending                                         │
└───────────────────────────────────────────────────────────────┘
```

### 2. Student Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                           │
├───────────────────────────────────────────────────────────────┤
│  📦 Pinjaman Aktif                                             │
│  └── Alat yang sedang dipinjam + info pengembalian            │
├───────────────────────────────────────────────────────────────┤
│  📅 Booking Mendatang                                          │
│  └── Ruangan yang sudah di-booking (max 5)                    │
├───────────────────────────────────────────────────────────────┤
│  ⏳ Request Pending                                            │
│  └── Pengajuan pinjaman yang belum divalidasi                 │
└───────────────────────────────────────────────────────────────┘
```

### 3. Lecturer Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                   LECTURER DASHBOARD                           │
├───────────────────────────────────────────────────────────────┤
│  📅 Booking Mendatang                                          │
│  └── Ruangan yang sudah di-booking (max 10)                   │
├───────────────────────────────────────────────────────────────┤
│  📊 Total Bookings                                             │
│  └── Jumlah booking yang sudah dilakukan                      │
└───────────────────────────────────────────────────────────────┘
```

## Data Model

### Service Class: `DashboardService`

Service utama yang menangani logika bisnis dashboard.

| Method | Deskripsi |
|--------|-----------|
| `getAdminStats()` | Statistik admin (total, pending, recent) |
| `getStudentDashboard(userId)` | Data dashboard mahasiswa |
| `getLecturerDashboard(userId)` | Data dashboard dosen |
| `markLoanNotificationRead(loanId)` | Tandai notifikasi pinjaman sudah dibaca |
| `markBookingNotificationRead(bookingId)` | Tandai notifikasi booking sudah dibaca |
| `markAllNotificationsRead()` | Tandai semua notifikasi sudah dibaca |
| `getLoanTrendData()` | Data tren peminjaman 7 hari |
| `getBookingsByRoom()` | Statistik booking per ruangan |
| `getLoansByCategory()` | Statistik pinjaman per kategori |
| `getIdleItemsCount()` | Jumlah alat tidak aktif >60 hari |
| `getPendingCounts()` | Semua pending counts untuk insights |
| `getRecentBookings(days)` | Booking terbaru untuk deteksi jam sibuk |

### Analytics Utilities

| Function | Deskripsi |
|----------|-----------|
| `calculateTrend(current, previous)` | Hitung tren persentase naik/turun |
| `detectPeakHours(bookings)` | Deteksi jam sibuk dari data booking |
| `generateInsights(data)` | Generate insights berdasarkan rule |
| `formatChartData(data, format)` | Format data untuk chart display |

## Server Actions

Action file: `features/dashboard/actions.ts`

| Action | Deskripsi |
|--------|-----------|
| `getAdminStats()` | Ambil statistik admin |
| `getStudentDashboard(userId)` | Ambil data dashboard mahasiswa |
| `getLecturerDashboard(userId)` | Ambil data dashboard dosen |
| `markLoanNotificationRead(loanId)` | Mark notifikasi loan dibaca |
| `markBookingNotificationRead(bookingId)` | Mark notifikasi booking dibaca |
| `markAllNotificationsRead()` | Mark semua notifikasi dibaca |
| `getLoanTrendData()` | Data tren peminjaman |
| `getBookingsByRoom()` | Statistik booking per ruangan |
| `getLoansByCategory()` | Statistik pinjaman per kategori |
| `getIdleItemsCount()` | Jumlah alat idle |
| `getPendingCounts()` | Semua pending counts |
| `getRecentBookings(days)` | Booking terbaru |

## UI Components

| Component | Deskripsi |
|-----------|-----------|
| `StatCard` | Kartu statistik dengan animasi dan tren |
| `TrendChart` | Chart line untuk data tren |
| `CategoryBarChart` | Bar chart untuk kategori |
| `InsightCard` | Kartu insight dengan ikon dan deskripsi |

## Halaman Terkait

| Route | Deskripsi |
|-------|-----------|
| `/admin/dashboard` | Dashboard admin dengan statistik lengkap |
| `/student/dashboard` | Dashboard mahasiswa |
| `/lecturer/dashboard` | Dashboard dosen |
| `/dashboard` | Redirect berdasarkan role |

## Insights (Rule-Based)

Dashboard admin menampilkan insights berdasarkan kondisi berikut:

| Kondisi | Insight |
|---------|---------|
| Tren pinjaman naik >20% | 📈 Info tentang kenaikan |
| Total pending >5 | ⏳ Warning validasi tertunda |
| Publikasi pending >3 | 📝 Info publikasi pending |
| Alat idle >0 | ⚠️ Warning alat tidak aktif |
| Peak hours terdeteksi | ⏰ Info jam sibuk |
| Kehadiran rendah | 📉 Warning kehadiran |
| Semua baik | ✅ Success message |

## Notifikasi Auto-Approved

Admin akan menerima notifikasi untuk:

1. **Pinjaman Auto-Approved**: Request dengan upload Surat Izin
2. **Booking Auto-Approved**: Request dengan upload Surat Permohonan
3. **Pengembalian Auto-Verified**: Pengembalian dengan upload Foto Bukti

Notifikasi ini ditandai dengan flag `notificationRead` yang bisa di-dismiss.

## Security

- Student hanya bisa akses data milik sendiri
- Lecturer hanya bisa akses data milik sendiri
- Admin bisa akses semua statistik dan data

## Relasi

- **Inventory**: Statistik alat dan peminjaman
- **Loans**: Data peminjaman aktif dan pending
- **Bookings**: Data booking ruangan
- **Users**: Data user untuk validasi role
- **Publications**: Pending publikasi (admin only)
