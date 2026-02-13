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

## Smart Insights — Sistem Pelaporan Cerdas (Smart Reporting)

Dashboard admin menampilkan **insight otomatis** yang dihasilkan dari analisis data real-time. Sistem ini menggunakan pendekatan **Rule-Based Expert System** — sekumpulan aturan (rules) yang mengevaluasi kondisi data saat ini dan menghasilkan rekomendasi berdasarkan threshold yang telah ditentukan.

### Arsitektur Sistem

```
┌──────────────┐     ┌───────────────────────────────────────────────┐
│   Database   │     │           DATA AGGREGATION LAYER              │
│   (MySQL)    │────▶│  getSmartAnalyticsData()                      │
│              │     │  ├── getOverdueLoans()         (overdue)      │
│  item_loans  │     │  ├── getUpcomingDeadlines(3)   (jatuh tempo)  │
│  room_bookings     │  ├── getDayOfWeekStats()       (pola harian)  │
│  items       │     │  ├── getRoomUtilization()      (utilisasi)    │
│  rooms       │     │  ├── getLoanTrend14Days()       (tren 14 hari)│
│  users       │     │  ├── getIdleItemsCount()        (alat idle)   │
│  publications│     │  ├── getPendingCounts()         (antrian)     │
│              │     │  └── getRecentBookings(30)      (30 hari)     │
└──────────────┘     └───────────────┬───────────────────────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────────────────────┐
                     │         ANALYTICS ENGINE (Client-side)        │
                     │  generateSmartInsights(data)                  │
                     │  ├── 10 Rules yang dievaluasi secara sekuensial│
                     │  ├── Setiap rule menghasilkan 0 atau 1 insight│
                     │  ├── Sorting berdasarkan prioritas            │
                     │  └── Output: max 6 insights                   │
                     └───────────────┬───────────────────────────────┘
                                     │
                                     ▼
                     ┌───────────────────────────────────────────────┐
                     │            PRESENTATION LAYER                 │
                     │  InsightCard × 6 (grid 3 kolom)               │
                     │  TrendChart (line chart 7 hari)               │
                     │  CategoryBarChart (top 5 ruangan)             │
                     └───────────────────────────────────────────────┘
```

### Data Pipeline (Alur Data)

Alur pengambilan data dilakukan secara **paralel** menggunakan `Promise.all()` untuk efisiensi:

```
getSmartAnalyticsData()
  │
  ├── [Paralel] 8 query database secara bersamaan
  │     ├── getOverdueLoans()        → loans WHERE status='Disetujui' AND returnPlanDate < NOW()
  │     ├── getUpcomingDeadlines(3)  → COUNT loans WHERE returnPlanDate BETWEEN NOW() AND NOW()+3 hari
  │     ├── getDayOfWeekStats()     → GROUP BY DAYOFWEEK(startTime) dari bookings 30 hari terakhir
  │     ├── getRoomUtilization()    → COUNT items (tersedia vs tidak), top 5 ruangan
  │     ├── getLoanTrend14Days()    → COUNT loans per hari, 14 hari terakhir (GROUP BY DATE)
  │     ├── getIdleItemsCount()    → COUNT items berstatus 'Tersedia' tanpa pinjaman >60 hari
  │     ├── getPendingCounts()     → COUNT pending loans, bookings, users, publications
  │     └── getRecentBookings(30)  → SELECT startTime dari bookings 30 hari terakhir
  │
  ├── [Client] Data dikirim ke browser via Server Action
  │
  └── [Client] generateSmartInsights(data) → menghasilkan insight
```

---

### Algoritma yang Digunakan

#### 1. Trend Calculation (Perhitungan Tren)

**Tujuan:** Membandingkan aktivitas minggu ini vs minggu lalu untuk mendeteksi kenaikan/penurunan.

**Metode:** Perbandingan persentase (Week-over-Week Comparison)

**Rumus:**

```
percentage = ((current - previous) / previous) × 100
```

**Logika Keputusan:**

```
Input: 14 hari data pinjaman (last7 = hari ke-8..14, prev7 = hari ke-1..7)

thisWeekTotal = Σ last7[i].count     (total pinjaman 7 hari terakhir)
prevWeekTotal = Σ prev7[i].count     (total pinjaman 7 hari sebelumnya)

IF prevWeekTotal == 0:
    percentage = IF thisWeekTotal > 0 THEN 100 ELSE 0
    direction = IF thisWeekTotal > 0 THEN 'up' ELSE 'stable'
ELSE:
    percentage = |( (thisWeekTotal - prevWeekTotal) / prevWeekTotal ) × 100|
    direction = IF percentage > 5 THEN 'up'
                ELSE IF percentage < -5 THEN 'down'
                ELSE 'stable'
```

**Threshold:**
| Kondisi | Output |
|---------|--------|
| Naik > 15% | 📈 Insight "Peminjaman naik X%" (priority: `medium`) |
| Turun > 30% | 📉 Insight "Peminjaman turun X%" (priority: `low`) |
| -5% s/d +5% | Stabil — tidak menghasilkan insight |
| +5% s/d +15% | Naik ringan — tidak menghasilkan insight |

---

#### 2. Peak Hour Detection (Deteksi Jam Sibuk)

**Tujuan:** Mengidentifikasi jam-jam tersibuk berdasarkan data booking ruangan.

**Metode:** Frequency Count + Top-K Selection

**Pseudocode:**

```
Input: bookings[] (30 hari terakhir)

1. Inisialisasi hourCounts = {} (dictionary jam → jumlah)
2. UNTUK SETIAP booking DALAM bookings:
      hour = booking.startTime.getHours()    // 0-23
      hourCounts[hour] += 1
3. Urutkan hourCounts DESCENDING by count
4. RETURN top 3 jam tersibuk
```

**Contoh Output:** Jam 09:00 (12 booking), 10:00 (9 booking), 13:00 (7 booking)

**Trigger Insight:** Jam dengan booking terbanyak ditampilkan → "🕐 Jam tersibuk: 09:00 – 10:00"

---

#### 3. Busiest Day Detection (Deteksi Hari Tersibuk)

**Tujuan:** Mengidentifikasi hari dalam seminggu yang paling banyak aktivitas booking.

**Metode:** SQL `DAYOFWEEK()` + Aggregation

**Query:**
```sql
SELECT DAYOFWEEK(start_time) AS dayOfWeek, COUNT(*) AS count
FROM room_bookings
WHERE start_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
  AND status = 'Disetujui'
GROUP BY DAYOFWEEK(start_time)
```

**Mapping:** MySQL `DAYOFWEEK`: 1=Minggu, 2=Senin, ..., 7=Sabtu

**Trigger:** Jika hari tersibuk memiliki > 3 booking dalam 30 hari → "📅 Hari tersibuk: Senin"

---

#### 4. Room Utilization & Item Availability (Utilisasi Ruangan & Ketersediaan Alat)

**Tujuan:** Mengukur persentase alat yang tersedia dan mengidentifikasi ruangan terpopuler.

**Rumus Ketersediaan:**

```
availabilityRate = ((totalItems - unavailableItems) / totalItems) × 100
```

Dimana:
- `totalItems` = `COUNT(*) FROM items`
- `unavailableItems` = `COUNT(*) FROM items WHERE status != 'Tersedia'` (dipinjam, maintenance, dsb.)

**Threshold Ketersediaan:**
| Rate | Severity | Insight |
|------|----------|---------|
| < 50% | `danger` (critical) | 📦 "Hanya X% alat tersedia" — N dari M alat tidak tersedia |
| < 75% | `warning` (medium) | 📦 "Ketersediaan alat X%" — perlu perhatian |
| ≥ 75% | — | Tidak menghasilkan insight (kondisi normal) |

**Ruangan Terpopuler:**

```sql
SELECT rooms.name, COUNT(*) AS count
FROM room_bookings
JOIN rooms ON room_bookings.room_id = rooms.id
WHERE status = 'Disetujui'
GROUP BY rooms.name
ORDER BY count DESC
LIMIT 5
```

**Trigger:** Jika ruangan teratas > 5 booking → "🏠 Ruangan terpopuler: Lab Komputer 1"

---

#### 5. Overdue Detection (Deteksi Keterlambatan)

**Tujuan:** Mengidentifikasi peminjaman yang melewati batas waktu pengembalian.

**Query:**
```sql
SELECT id, student_name, item_name, return_plan_date
FROM item_loans
JOIN users ON loans.student_id = users.id
JOIN items ON loans.item_id = items.id
WHERE status = 'Disetujui'
  AND return_plan_date < NOW()
```

**Perhitungan Hari Terlambat:**
```
overdueDays = FLOOR( (NOW() - returnPlanDate) / 86400000 )   // ms → hari
oldestDays = MAX(overdueDays) dari semua overdue loans
```

**Trigger:** Jika ada ≥1 overdue → 🚨 "N peminjaman melewati batas waktu — terlambat X hari" (priority: `critical`)

---

#### 6. Idle Item Detection (Deteksi Alat Idle)

**Tujuan:** Mengidentifikasi alat yang tersedia tetapi tidak pernah digunakan dalam 60+ hari.

**Query:**
```sql
SELECT COUNT(*) FROM items i
WHERE i.status = 'Tersedia'
  AND NOT EXISTS (
      SELECT 1 FROM item_loans l
      WHERE l.item_id = i.id
        AND l.request_date >= DATE_SUB(NOW(), INTERVAL 60 DAY)
  )
```

**Trigger:** Jika > 0 alat idle → 💤 "N alat tidak pernah digunakan — >60 hari tanpa pinjaman" (priority: `medium`)

---

### Rule Engine — Mesin Aturan

Fungsi `generateSmartInsights()` mengevaluasi **10 aturan** secara **sekuensial**. Setiap aturan menghasilkan 0 atau 1 insight. Hasil akhir **diurutkan berdasarkan prioritas** dan **dibatasi maksimal 6**.

#### Tabel Aturan Lengkap

| # | Nama Rule | Kondisi Trigger | Prioritas | Kategori | Output |
|---|-----------|-----------------|-----------|----------|--------|
| 1 | Overdue Loans | `overdueLoans.length > 0` | `critical` | `danger` | 🚨 N peminjaman melewati batas waktu — terlambat X hari |
| 2 | Upcoming Deadlines | `upcomingDeadlines > 0` | `high` | `warning` | ⏰ N pengembalian dalam 3 hari |
| 3 | Pending Queue | `totalPending > 0` | `high` jika >5, `medium` jika ≤5 | `warning`/`info` | 📋 N menunggu validasi: breakdown per jenis |
| 4a | Loan Trend Up | Naik > 15% WoW | `medium` | `info` | 📈 Peminjaman naik X% |
| 4b | Loan Trend Down | Turun > 30% WoW | `low` | `info` | 📉 Peminjaman turun X% |
| 5a | Low Availability | rate < 50% | `high` | `danger` | 📦 Hanya X% alat tersedia |
| 5b | Medium Availability | 50% ≤ rate < 75% | `medium` | `warning` | 📦 Ketersediaan alat X% |
| 6 | Idle Items | `idleItems > 0` | `medium` | `warning` | 💤 N alat idle >60 hari |
| 7 | Busiest Day | hari tersibuk > 3 booking | `low` | `info` | 📅 Hari tersibuk: X |
| 8 | Peak Hours | ada data booking | `low` | `info` | 🕐 Jam tersibuk: HH:00 |
| 9 | Pending Publications | > 3 pending | `low` | `info` | 📝 N publikasi menunggu review |
| 10 | Popular Room | > 5 booking | `low` | `info` | 🏠 Ruangan terpopuler: X |
| — | No Issues | tidak ada insight | `low` | `success` | ✅ Semua berjalan baik! |

#### Alur Evaluasi

```
generateSmartInsights(data):
  insights = []

  // ── Evaluasi sekuensial, setiap rule berdiri sendiri ──
  Rule 1: IF overdueLoans.length > 0 → PUSH insight (critical)
  Rule 2: IF upcomingDeadlines > 0 → PUSH insight (high)
  Rule 3: IF totalPending > 0 → PUSH insight (high/medium)
  Rule 4: IF trend.up > 15% → PUSH (medium)
           ELIF trend.down > 30% → PUSH (low)
  Rule 5: IF availability < 50% → PUSH (high)
           ELIF availability < 75% → PUSH (medium)
  Rule 6: IF idleItems > 0 → PUSH (medium)
  Rule 7: IF busiestDay.count > 3 → PUSH (low)
  Rule 8: IF peakHours.length > 0 → PUSH (low)
  Rule 9: IF pendingPublications > 3 → PUSH (low)
  Rule 10: IF topRoom.count > 5 → PUSH (low)

  // ── Fallback (jika tidak ada insight sama sekali) ──
  IF insights.length == 0:
      PUSH "Semua berjalan baik!" (success)

  // ── Sorting berdasarkan prioritas ──
  priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  SORT insights BY priorityOrder[insight.priority] ASC

  // ── Batasi output ──
  RETURN insights[0..5]   // maksimal 6 insight
```

#### Sistem Prioritas (Priority Ranking)

Insight diurutkan menggunakan **numerical priority mapping**:

| Priority | Nilai | Warna Badge | Contoh |
|----------|-------|-------------|--------|
| `critical` | 0 (tertinggi) | 🔴 Merah | Overdue loans |
| `high` | 1 | 🟠 Amber | Pengembalian mendekati deadline |
| `medium` | 2 | 🔵 Biru | Tren peminjaman naik |
| `low` | 3 (terendah) | ⚪ Abu-abu | Pola hari tersibuk |

Sorting menggunakan **ascending order** — insight kritis selalu tampil di depan.

---

### Kategori Visual Insight

Setiap insight memiliki tipe visual yang menentukan warna latar kartu:

| Type | Warna Latar | Kegunaan |
|------|-------------|----------|
| `danger` | Merah muda | Isu kritis yang memerlukan tindakan segera |
| `warning` | Kuning muda | Isu yang perlu perhatian |
| `info` | Biru muda | Informasi dan pola yang berguna |
| `success` | Hijau muda | Tidak ada isu (semua baik) |

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
