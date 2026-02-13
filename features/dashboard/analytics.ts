/**
 * Dashboard Smart Analytics Engine
 * Contextual insights based on real data patterns
 */

export interface TrendResult {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
}

export type InsightPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Insight {
    type: 'info' | 'warning' | 'success' | 'danger';
    icon: string;
    title: string;
    description: string;
    priority: InsightPriority;
    actionLabel?: string;
    actionHref?: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

const DAY_NAMES_ID = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/* ── Trend calculation ──────────────────────────────────── */

export function calculateTrend(current: number, previous: number): TrendResult {
    if (previous === 0) {
        return { value: current, percentage: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'stable' };
    }
    const percentage = Math.round(((current - previous) / previous) * 100);
    let direction: 'up' | 'down' | 'stable' = 'stable';
    if (percentage > 5) direction = 'up';
    else if (percentage < -5) direction = 'down';
    return { value: current, percentage: Math.abs(percentage), direction };
}

/* ── Peak hours detection ───────────────────────────────── */

export function detectPeakHours(bookings: { startTime: Date }[]): { hour: number; count: number }[] {
    const hourCounts: Record<number, number> = {};
    bookings.forEach(b => {
        const hour = new Date(b.startTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });
    return Object.entries(hourCounts)
        .map(([hour, count]) => ({ hour: parseInt(hour), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
}

/* ── Busiest day detection ──────────────────────────────── */

export function detectBusiestDay(dayStats: { dayOfWeek: number; count: number }[]): { dayName: string; count: number } | null {
    if (dayStats.length === 0) return null;
    const busiest = dayStats.sort((a, b) => b.count - a.count)[0];
    // MySQL DAYOFWEEK: 1=Sun, 2=Mon, ... 7=Sat
    const dayIdx = busiest.dayOfWeek - 1;
    return { dayName: DAY_NAMES_ID[dayIdx] || 'N/A', count: busiest.count };
}

/* ── Smart Insight Generator ────────────────────────────── */

export interface SmartInsightData {
    // Trend (14 days)
    trendData14: { date: string; count: number }[];
    // Pending counts
    pendingCounts: {
        pendingLoans: number;
        pendingBookings: number;
        pendingUsers: number;
        pendingPublications: number;
    };
    // Overdue loans
    overdueLoans: { id: number; studentName: string | null; itemName: string | null; returnPlanDate: Date }[];
    // Upcoming deadlines (3 days)
    upcomingDeadlines: number;
    // Day of week stats
    dayOfWeekStats: { dayOfWeek: number; count: number }[];
    // Room utilization
    roomUtilization: {
        itemAvailabilityRate: number;
        unavailableItems: number;
        totalItems: number;
        totalRooms: number;
        topRooms: { roomName: string | null; count: number }[];
    };
    // Existing
    idleItems: number;
    recentBookings: { startTime: Date }[];
}

export function generateSmartInsights(data: SmartInsightData): Insight[] {
    const insights: Insight[] = [];

    // ─── 1. CRITICAL: Overdue loans ───────────────────────
    if (data.overdueLoans.length > 0) {
        const count = data.overdueLoans.length;
        const oldestDays = data.overdueLoans.reduce((max, loan) => {
            const days = Math.floor((Date.now() - new Date(loan.returnPlanDate).getTime()) / 86400000);
            return Math.max(max, days);
        }, 0);
        insights.push({
            type: 'danger',
            icon: '🚨',
            title: `${count} peminjaman melewati batas waktu`,
            description: `Terlambat hingga ${oldestDays} hari. Segera tindak lanjuti pengembalian.`,
            priority: 'critical',
            actionLabel: 'Lihat Validasi',
            actionHref: '/admin/validations?tab=loans',
        });
    }

    // ─── 2. HIGH: Upcoming return deadlines ───────────────
    if (data.upcomingDeadlines > 0) {
        insights.push({
            type: 'warning',
            icon: '⏰',
            title: `${data.upcomingDeadlines} pengembalian dalam 3 hari`,
            description: 'Persiapkan proses penerimaan barang kembali.',
            priority: 'high',
        });
    }

    // ─── 3. HIGH: Pending validations with breakdown ──────
    const { pendingLoans, pendingBookings, pendingUsers } = data.pendingCounts;
    const totalPending = pendingLoans + pendingBookings + pendingUsers;
    if (totalPending > 0) {
        const parts: string[] = [];
        if (pendingLoans > 0) parts.push(`${pendingLoans} pinjaman`);
        if (pendingBookings > 0) parts.push(`${pendingBookings} booking`);
        if (pendingUsers > 0) parts.push(`${pendingUsers} registrasi`);
        insights.push({
            type: totalPending > 5 ? 'warning' : 'info',
            icon: '📋',
            title: `${totalPending} menunggu validasi`,
            description: parts.join(', ') + ' perlu ditinjau.',
            priority: totalPending > 5 ? 'high' : 'medium',
            actionLabel: 'Validasi Sekarang',
            actionHref: '/admin/validations',
        });
    }

    // ─── 4. MEDIUM: Loan trend (week-over-week) ───────────
    const last7 = data.trendData14.slice(-7);
    const prev7 = data.trendData14.slice(0, 7);
    const thisWeekTotal = last7.reduce((s, d) => s + d.count, 0);
    const prevWeekTotal = prev7.reduce((s, d) => s + d.count, 0);
    const loansTrend = calculateTrend(thisWeekTotal, prevWeekTotal);

    if (loansTrend.direction === 'up' && loansTrend.percentage > 15) {
        insights.push({
            type: 'info',
            icon: '📈',
            title: `Peminjaman naik ${loansTrend.percentage}% dari minggu lalu`,
            description: thisWeekTotal > 10
                ? 'Lonjakan signifikan — pastikan stok alat memadai.'
                : 'Aktivitas mulai meningkat.',
            priority: 'medium',
        });
    } else if (loansTrend.direction === 'down' && loansTrend.percentage > 30) {
        insights.push({
            type: 'info',
            icon: '📉',
            title: `Peminjaman turun ${loansTrend.percentage}% dari minggu lalu`,
            description: 'Aktivitas menurun — bisa jadi masa libur atau ujian.',
            priority: 'low',
        });
    }

    // ─── 5. MEDIUM: Item availability pressure ────────────
    const rate = data.roomUtilization.itemAvailabilityRate;
    if (rate < 50) {
        insights.push({
            type: 'danger',
            icon: '📦',
            title: `Hanya ${rate}% alat tersedia`,
            description: `${data.roomUtilization.unavailableItems} dari ${data.roomUtilization.totalItems} alat sedang dipinjam/maintenance.`,
            priority: 'high',
        });
    } else if (rate < 75) {
        insights.push({
            type: 'warning',
            icon: '📦',
            title: `Ketersediaan alat ${rate}%`,
            description: `${data.roomUtilization.unavailableItems} alat tidak tersedia saat ini.`,
            priority: 'medium',
        });
    }

    // ─── 6. MEDIUM: Idle items ────────────────────────────
    if (data.idleItems > 0) {
        insights.push({
            type: 'warning',
            icon: '💤',
            title: `${data.idleItems} alat tidak pernah digunakan`,
            description: 'Tidak ada peminjaman selama >60 hari. Pertimbangkan review atau maintenance.',
            priority: 'medium',
        });
    }

    // ─── 7. LOW: Busiest day pattern ──────────────────────
    const busiestDay = detectBusiestDay([...data.dayOfWeekStats]);
    if (busiestDay && busiestDay.count > 3) {
        insights.push({
            type: 'info',
            icon: '📅',
            title: `Hari tersibuk: ${busiestDay.dayName}`,
            description: `${busiestDay.count} booking dalam 30 hari terakhir di hari ${busiestDay.dayName}.`,
            priority: 'low',
        });
    }

    // ─── 8. LOW: Peak hours ───────────────────────────────
    const peakHours = detectPeakHours(data.recentBookings);
    if (peakHours.length > 0) {
        const peak = peakHours[0];
        insights.push({
            type: 'info',
            icon: '🕐',
            title: `Jam tersibuk: ${String(peak.hour).padStart(2, '0')}:00 – ${String(peak.hour + 1).padStart(2, '0')}:00`,
            description: `${peak.count} booking terpusat di jam ini. Pertimbangkan penyesuaian jadwal.`,
            priority: 'low',
        });
    }

    // ─── 9. LOW: Pending publications ─────────────────────
    if (data.pendingCounts.pendingPublications > 3) {
        insights.push({
            type: 'info',
            icon: '📝',
            title: `${data.pendingCounts.pendingPublications} publikasi menunggu review`,
            description: 'Publikasi mahasiswa belum ditinjau.',
            priority: 'low',
        });
    }

    // ─── 10. Room popularity ──────────────────────────────
    const topRoom = data.roomUtilization.topRooms[0];
    if (topRoom && topRoom.count > 5) {
        insights.push({
            type: 'info',
            icon: '🏠',
            title: `Ruangan terpopuler: ${topRoom.roomName}`,
            description: `${topRoom.count} booking disetujui. Pastikan fasilitas terjaga.`,
            priority: 'low',
        });
    }

    // Sort by priority (critical first)
    const priorityOrder: Record<InsightPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    insights.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    // If no issues, congrats message
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            icon: '✅',
            title: 'Semua berjalan baik!',
            description: 'Tidak ada isu yang memerlukan perhatian saat ini.',
            priority: 'low',
        });
    }

    return insights.slice(0, 6); // Max 6 insights
}

/* ── Chart formatting ───────────────────────────────────── */

export function formatChartData(
    data: { date: Date | string; count: number }[],
    labelFormat: 'day' | 'week' | 'month' = 'day'
): ChartDataPoint[] {
    return data.map(d => {
        const date = new Date(d.date);
        let name: string;
        switch (labelFormat) {
            case 'day':
                name = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                break;
            case 'week':
                name = `Minggu ${Math.ceil(date.getDate() / 7)}`;
                break;
            case 'month':
                name = date.toLocaleDateString('id-ID', { month: 'short' });
                break;
        }
        return { name, value: d.count };
    });
}
