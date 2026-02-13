# Dashboard

## Deskripsi

Dashboard adalah halaman utama yang menampilkan ringkasan statistik dan aktivitas terbaru berdasarkan role pengguna. Setiap role memiliki tampilan dashboard yang berbeda sesuai kebutuhan aksesnya.

## User Access

| Role | Akses |
|------|-------|
| **Admin** | Statistik lengkap, notifikasi, insights, analytics, dan kehadiran |
| **Dosen** | Booking ruangan mendatang, insight cepat |
| **Mahasiswa** | Pinjaman aktif, booking mendatang, request pending |

## Routing

| Route | Deskripsi |
|-------|-----------|
| `/dashboard` | Redirect otomatis berdasarkan role user |
| `/admin/dashboard` | Dashboard admin dengan statistik lengkap |
| `/student/dashboard` | Dashboard mahasiswa |
| `/lecturer/dashboard` | Dashboard dosen |

Halaman `/dashboard` memanggil `getSession()` lalu redirect ke dashboard sesuai role:
- `Admin` → `/admin/dashboard`
- `Mahasiswa` → `/student/dashboard`
- `Dosen` → `/lecturer/dashboard`

---

## Fitur per Role

### 1. Admin Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                           │
├───────────────────────────────────────────────────────────────┤
│  🔔 Notifikasi (DashboardNotifications)                       │
│  ├── Pending User (registrasi baru)                          │
│  ├── Pending Peminjaman                                       │
│  ├── Pending Booking Ruangan                                  │
│  ├── Pinjaman Auto-Approved (dengan Surat Izin)              │
│  ├── Booking Auto-Approved (dengan Surat Permohonan)         │
│  └── Pengembalian Auto-Verified (dengan Foto Bukti)          │
├───────────────────────────────────────────────────────────────┤
│  📈 Analytics (DashboardAnalytics) — client-side              │
│  ├── 💡 Insights (rule-based, max 4)                          │
│  ├── Tren Peminjaman (chart line, 7 hari terakhir)           │
│  └── Booking per Ruangan (bar chart, top 5)                  │
├───────────────────────────────────────────────────────────────┤
│  📋 Kehadiran                                                  │
│  ├── Kehadiran Hari Ini (TodayAttendance)                    │
│  └── Statistik Kehadiran per Ruangan (RoomAttendanceChart)   │
├───────────────────────────────────────────────────────────────┤
│  📊 Statistik Utama (4 kartu)                                 │
│  ├── Total Alat                                               │
│  ├── Peminjaman Aktif                                         │
│  ├── Pending Peminjaman (link ke /admin/validations?tab=loans)│
│  └── Pending Booking (link ke /admin/validations?tab=rooms)  │
├───────────────────────────────────────────────────────────────┤
│  📦 Status Alat (progress bar per status)                     │
│  ├── Tersedia (hijau)                                         │
│  ├── Dipinjam (oranye)                                        │
│  └── Lainnya (abu-abu)                                        │
├───────────────────────────────────────────────────────────────┤
│  📝 2 Kolom: Peminjaman Aktif + Booking Ruangan Aktif         │
│  ├── 5 peminjaman terbaru (status Disetujui)                 │
│  └── 5 booking terbaru (status Disetujui)                    │
└───────────────────────────────────────────────────────────────┘
```

### 2. Student Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                    STUDENT DASHBOARD                           │
├───────────────────────────────────────────────────────────────┤
│  📦 Pinjaman Aktif                                             │
│  └── Alat yang sedang dipinjam + info item, kategori, ruangan│
│      + tanggal rencana pengembalian                           │
├───────────────────────────────────────────────────────────────┤
│  📅 Booking Mendatang                                          │
│  └── Booking ruangan yang disetujui & akan datang (max 5)    │
├───────────────────────────────────────────────────────────────┤
│  ⏳ Request Pending                                            │
│  └── Pengajuan pinjaman yang belum divalidasi                │
└───────────────────────────────────────────────────────────────┘
```

### 3. Lecturer Dashboard

```
┌───────────────────────────────────────────────────────────────┐
│                   LECTURER DASHBOARD                           │
├───────────────────────────────────────────────────────────────┤
│  📊 Statistik (2 kartu)                                        │
│  ├── Booking Mendatang (jumlah)                               │
│  └── Quick Insight (info kontekstual)                         │
├───────────────────────────────────────────────────────────────┤
│  📅 Booking Ruangan Saya                                       │
│  └── 5 booking mendatang (nama ruangan, tanggal, jam, tujuan)│
│  └── Link ke /lecturer/rooms untuk lihat semua               │
└───────────────────────────────────────────────────────────────┘
```

---

## Arsitektur & File

### Service Layer

**File**: `features/dashboard/service.ts`

| Method | Deskripsi | Auth |
|--------|-----------|------|
| `getAdminStats()` | Statistik lengkap: total items, active/pending loans, pending bookings, pending returns, item stats, recent loans/bookings, auto-approved loans/bookings, auto-returned loans | Admin |
| `getStudentDashboard(userId)` | Active loans (dengan item, kategori, ruangan), upcoming bookings, pending requests | Student |
| `getLecturerDashboard(userId)` | Upcoming bookings (max 10), total bookings count | Lecturer |
| `markLoanNotificationRead(loanId)` | Set `notificationRead = '1'` pada loan | Admin |
| `markBookingNotificationRead(bookingId)` | Set `notificationRead = '1'` pada booking | Admin |
| `markAllNotificationsRead()` | Mark semua notifikasi (loan, booking, return) sebagai dibaca | Admin |
| `getLoanTrendData()` | Data jumlah pinjaman per hari (7 hari terakhir) | Admin |
| `getBookingsByRoom()` | Booking count per ruangan, top 5, untuk chart | Admin |
| `getLoansByCategory()` | Pinjaman count per kategori, top 5, untuk chart | Admin |
| `getIdleItemsCount()` | Jumlah alat berstatus "Tersedia" yang tidak dipinjam >60 hari | Admin |
| `getPendingCounts()` | Pending loans, bookings, users, publications | Admin |
| `getRecentBookings(days)` | Booking terbaru (default 30 hari) untuk deteksi jam sibuk | Admin |
| `getOverdueLoans()` | Pinjaman aktif yang melewati `returnPlanDate` (overdue) | Admin |
| `getUpcomingDeadlines(days)` | Jumlah pinjaman yang jatuh tempo dalam N hari (default 3) | Admin |
| `getDayOfWeekStats()` | Statistik booking per hari dalam seminggu (30 hari terakhir) | Admin |
| `getRoomUtilization()` | Tingkat ketersediaan alat, jumlah ruangan, top 5 ruangan terpopuler | Admin |
| `getLoanTrend14Days()` | Data tren pinjaman 14 hari untuk perbandingan week-over-week | Admin |
| `getSmartAnalyticsData()` | Aggregate: semua data smart analytics dalam 1 panggilan paralel | Admin |

### Analytics Utilities

**File**: `features/dashboard/analytics.ts`

| Function | Signature | Deskripsi |
|----------|-----------|-----------|
| `calculateTrend` | `(current, previous) → TrendResult` | Hitung persentase naik/turun (threshold ±5%) |
| `detectPeakHours` | `(bookings) → { hour, count }[]` | Deteksi 3 jam tersibuk dari data booking |
| `detectBusiestDay` | `(dayStats) → { dayName, count }` | Deteksi hari tersibuk dalam seminggu |
| `generateSmartInsights` | `(SmartInsightData) → Insight[]` | Generate max **6** insights, diurutkan berdasarkan prioritas |
| `formatChartData` | `(data, format) → ChartDataPoint[]` | Format data untuk chart (day/week/month label) |

### Server Actions

**File**: `features/dashboard/actions.ts`

| Action | Auth | Deskripsi |
|--------|------|-----------|
| `getAdminStats()` | `requireAdmin()` | Ambil statistik admin |
| `getStudentDashboard(userId)` | — | Ambil data dashboard mahasiswa |
| `getLecturerDashboard(userId)` | — | Ambil data dashboard dosen |
| `markLoanNotificationRead(loanId)` | `requireAdmin()` | Mark notifikasi loan dibaca |
| `markBookingNotificationRead(bookingId)` | `requireAdmin()` | Mark notifikasi booking dibaca |
| `markAllNotificationsRead()` | `requireAdmin()` | Mark semua notifikasi dibaca |
| `getLoanTrendData()` | `requireAdmin()` | Data tren peminjaman |
| `getBookingsByRoom()` | `requireAdmin()` | Statistik booking per ruangan |
| `getLoansByCategory()` | `requireAdmin()` | Statistik pinjaman per kategori |
| `getIdleItemsCount()` | `requireAdmin()` | Jumlah alat idle |
| `getPendingCounts()` | `requireAdmin()` | Semua pending counts |
| `getRecentBookings(days)` | `requireAdmin()` | Booking terbaru |
| `getSmartAnalyticsData()` | `requireAdmin()` | Aggregate data untuk smart insights |

---

## UI Components

### Shared Components (`features/dashboard/components/`)

| Component | Props | Deskripsi |
|-----------|-------|-----------|
| `StatCard` | `label, value, trend?, icon, color?` | Kartu statistik, warna: primary/green/yellow/red. Mendukung ikon tren (naik/turun/stabil) |
| `TrendChart` | `data: ChartDataPoint[], title, color` | Line chart untuk visualisasi tren data (pure CSS) |
| `CategoryBarChart` | `data: ChartDataPoint[], title, color` | Bar chart horizontal untuk perbandingan kategori |
| `InsightCard` | `insight: Insight` | Kartu insight: ikon emoji, judul, deskripsi, badge prioritas, action link. Tipe: info/warning/success/danger |

### Admin Page Components (`app/admin/dashboard/_components/`)

| Component | Tipe | Deskripsi |
|-----------|------|-----------|
| `DashboardNotifications` | Client | Menampilkan 6 jenis notifikasi: pending users/loans/bookings + auto-approved loans/bookings/returns. Setiap item bisa di-dismiss. |
| `DashboardAnalytics` | Client | Fetch smart analytics via `getSmartAnalyticsData()`, generate prioritized insights, chart 7-hari, booking per ruangan. |
| `MarkAllReadButton` | Client | Tombol untuk tandai semua notifikasi sebagai dibaca |
| `PendingLoansAlert` | — | Alert untuk pending peminjaman |
| `PendingBookingsAlert` | — | Alert untuk pending booking ruangan |
| `PendingUserAlert` | — | Alert untuk registrasi user baru |
| `TodayAttendance` | Client | Kehadiran hari ini |
| `RoomAttendanceChart` | Client | Chart statistik kehadiran per ruangan |

---

## Smart Insights (Prioritized)

Dashboard admin menampilkan maksimal **6 insights**, diurutkan berdasarkan prioritas.

### Prioritas Insight

| Level | Badge | Warna |
|-------|-------|-------|
| `critical` | Kritis | Merah |
| `high` | Penting | Amber |
| `medium` | Sedang | Biru |
| `low` | Info | Abu-abu |

### Daftar Insight Rules

| # | Kondisi | Prioritas | Tipe | Insight |
|---|---------|-----------|------|---------|
| 1 | Pinjaman overdue (lewat `returnPlanDate`) | `critical` | `danger` | 🚨 N peminjaman melewati batas waktu — terlambat X hari |
| 2 | Pengembalian dalam 3 hari | `high` | `warning` | ⏰ N pengembalian dalam 3 hari |
| 3 | Total pending > 0 (breakdown per jenis) | `high`/`medium` | `warning`/`info` | 📋 N menunggu validasi: X pinjaman, Y booking, Z registrasi |
| 4 | Tren pinjaman naik >15% week-over-week | `medium` | `info` | 📈 Peminjaman naik X% — lonjakan/mulai meningkat |
| 4b | Tren pinjaman turun >30% | `low` | `info` | 📉 Peminjaman turun X% — bisa jadi libur/ujian |
| 5 | Ketersediaan alat <50% | `high` | `danger` | 📦 Hanya X% alat tersedia |
| 5b | Ketersediaan alat <75% | `medium` | `warning` | 📦 Ketersediaan alat X% |
| 6 | Alat idle >0 (>60 hari tanpa pinjaman) | `medium` | `warning` | 💤 N alat tidak pernah digunakan |
| 7 | Hari tersibuk terdeteksi (>3 booking) | `low` | `info` | 📅 Hari tersibuk: Senin/Selasa/... |
| 8 | Jam tersibuk terdeteksi | `low` | `info` | 🕐 Jam tersibuk: HH:00 – HH+1:00 |
| 9 | Publikasi pending >3 | `low` | `info` | 📝 N publikasi menunggu review |
| 10 | Ruangan terpopuler (>5 booking) | `low` | `info` | 🏠 Ruangan terpopuler: Nama |
| — | Tidak ada isu | `low` | `success` | ✅ Semua berjalan baik! |

### Fitur InsightCard

- **Priority badge** — label warna sesuai level (kecuali `low`)
- **Action link** — beberapa insight memiliki tombol aksi (contoh: "Lihat Validasi →" yang mengarah ke halaman terkait)
- **Hover effect** — shadow saat mouse hover
- **Danger styling** — latar merah untuk isu kritis

---

## Notifikasi Admin

Admin menerima notifikasi otomatis untuk:

| Jenis | Trigger | Dismiss |
|-------|---------|---------|
| **Pending User** | Registrasi user baru (status Pending) | Link ke halaman validasi |
| **Pending Peminjaman** | Pengajuan pinjaman baru (status Pending) | Link ke halaman validasi |
| **Pending Booking** | Pengajuan booking baru (status Pending) | Link ke halaman validasi |
| **Auto-Approved Loan** | Pinjaman dengan Surat Izin (auto-approved) | `notificationRead` flag |
| **Auto-Approved Booking** | Booking dengan Surat Permohonan (auto-approved) | `notificationRead` flag |
| **Auto-Returned Loan** | Pengembalian dengan Foto Bukti (auto-verified) | `returnNotificationRead` flag |

Notifikasi auto-approved/auto-returned hanya muncul jika flag `notificationRead`/`returnNotificationRead` bernilai `'0'`. Admin dapat mendismiss satu per satu atau menggunakan tombol "Tandai Semua Dibaca".

---

## Data yang Di-query

### Admin Stats (`getAdminStats`)

```
totalItems        → COUNT(*) dari items
activeLoans       → COUNT(*) dari itemLoans WHERE status = 'Disetujui'
pendingLoans      → COUNT(*) dari itemLoans WHERE status = 'Pending'
pendingBookings   → COUNT(*) dari roomBookings WHERE status = 'Pending'
pendingReturns    → COUNT(*) dari itemLoans WHERE returnStatus = 'Pending'
itemStats         → GROUP BY items.status → [{status, count}]
recentLoans       → 5 loan terbaru (JOIN users + items)
recentBookings    → 5 booking terbaru (JOIN users + rooms)
autoApprovedLoans → max 10, status=Disetujui, notificationRead='0', suratIzin != null
autoApprovedBookings → max 10, status=Disetujui, notificationRead='0', suratPermohonan != null
autoReturnedLoans → max 10, returnStatus=Dikembalikan, returnNotificationRead='0', returnPhoto != null
```

### Student Dashboard (`getStudentDashboard`)

```
activeLoans       → Loans WHERE studentId=userId AND status='Disetujui'
                    JOIN items → categories → rooms
upcomingBookings  → Bookings WHERE userId AND status='Disetujui' AND startTime >= today
                    ORDER BY startTime, LIMIT 5
pendingRequests   → Loans WHERE studentId=userId AND status='Pending'
```

### Lecturer Dashboard (`getLecturerDashboard`)

```
upcomingBookings  → Bookings WHERE userId AND startTime >= today
                    ORDER BY startTime, LIMIT 10
totalBookings     → upcomingBookings.length
```

---

## Security

- **Admin**: Full akses ke semua statistik, analytics, dan notifikasi. Diproteksi `requireAdmin()`.
- **Student**: Hanya data milik sendiri (filter by `userId`).
- **Lecturer**: Hanya data milik sendiri (filter by `userId`).

## Relasi Fitur

| Fitur | Digunakan Untuk |
|-------|-----------------|
| **Inventory** (`items`, `itemCategories`) | Total alat, status distribusi, idle items |
| **Loans** (`itemLoans`) | Pinjaman aktif, pending, tren, auto-approved |
| **Bookings** (`roomBookings`, `rooms`) | Booking pending, per ruangan, peak hours |
| **Users** (`users`) | Validasi role, pending registrasi |
| **Publications** (`publications`) | Pending count untuk insights |
| **Attendance** | Kehadiran hari ini, statistik per ruangan |
