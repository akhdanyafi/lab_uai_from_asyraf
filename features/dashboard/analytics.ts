/**
 * Dashboard Analytics Service
 * Rule-based insights and trend calculations
 */

export interface TrendResult {
    value: number;
    percentage: number;
    direction: 'up' | 'down' | 'stable';
}

export interface Insight {
    type: 'info' | 'warning' | 'success';
    icon: string;
    title: string;
    description: string;
}

export interface ChartDataPoint {
    name: string;
    value: number;
}

/**
 * Calculate trend between two periods
 */
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

/**
 * Detect peak hours from booking data
 */
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

/**
 * Generate insights based on dashboard data
 */
export function generateInsights(data: {
    loansTrend?: TrendResult;
    bookingsTrend?: TrendResult;
    pendingLoans?: number;
    pendingBookings?: number;
    pendingUsers?: number;
    pendingPublications?: number;
    idleItems?: number;
    lowAttendanceClasses?: { name: string; rate: number }[];
    peakHours?: { hour: number; count: number }[];
}): Insight[] {
    const insights: Insight[] = [];

    // Loan trend insight
    if (data.loansTrend && data.loansTrend.direction === 'up' && data.loansTrend.percentage > 20) {
        insights.push({
            type: 'info',
            icon: '📈',
            title: `Peminjaman naik ${data.loansTrend.percentage}%`,
            description: 'Pastikan ketersediaan alat mencukupi'
        });
    }

    // Pending validations
    const totalPending = (data.pendingLoans || 0) + (data.pendingBookings || 0) + (data.pendingUsers || 0);
    if (totalPending > 5) {
        insights.push({
            type: 'warning',
            icon: '⏳',
            title: `${totalPending} item menunggu validasi`,
            description: 'Ada pengajuan yang perlu segera diproses'
        });
    }

    // Pending publications
    if (data.pendingPublications && data.pendingPublications > 3) {
        insights.push({
            type: 'info',
            icon: '📝',
            title: `${data.pendingPublications} publikasi pending`,
            description: 'Publikasi mahasiswa menunggu review'
        });
    }

    // Idle items
    if (data.idleItems && data.idleItems > 0) {
        insights.push({
            type: 'warning',
            icon: '⚠️',
            title: `${data.idleItems} alat tidak aktif`,
            description: 'Alat tidak dipinjam > 60 hari, review status'
        });
    }

    // Peak hours
    if (data.peakHours && data.peakHours.length > 0) {
        const peak = data.peakHours[0];
        insights.push({
            type: 'info',
            icon: '⏰',
            title: `Jam sibuk: ${peak.hour}:00 - ${peak.hour + 1}:00`,
            description: `${peak.count} booking di jam ini`
        });
    }

    // Low attendance
    if (data.lowAttendanceClasses && data.lowAttendanceClasses.length > 0) {
        const cls = data.lowAttendanceClasses[0];
        insights.push({
            type: 'warning',
            icon: '📉',
            title: `Kehadiran rendah: ${cls.name}`,
            description: `Rate kehadiran ${cls.rate}%`
        });
    }

    // If no issues, show positive insight
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            icon: '✅',
            title: 'Semua berjalan baik',
            description: 'Tidak ada isu yang memerlukan perhatian'
        });
    }

    return insights.slice(0, 4); // Max 4 insights
}

/**
 * Format data for chart display
 */
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
