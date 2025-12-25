/**
 * Formatter Utilities
 * Centralized formatting functions for dates, times, numbers, and currency
 */

const DEFAULT_TIMEZONE = 'Asia/Jakarta';
const DEFAULT_LOCALE = 'id-ID';

// ==================== DATE & TIME FORMATTERS ====================

/**
 * Format date and time with full details
 * Example: "Rabu, 25 Desember 2025, 22:51:25"
 */
export function formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Format date only (no time)
 * Example: "25 Desember 2025"
 */
export function formatDate(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format date with weekday
 * Example: "Rabu, 25 Desember 2025"
 */
export function formatDateWithDay(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Format date short
 * Example: "25/12/2025"
 */
export function formatDateShort(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

/**
 * Format time only
 * Example: "22:51"
 */
export function formatTime(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Format time with seconds
 * Example: "22:51:25"
 */
export function formatTimeWithSeconds(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleTimeString(DEFAULT_LOCALE, {
        timeZone: DEFAULT_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

/**
 * Format relative time (e.g., "2 jam yang lalu")
 */
export function formatRelativeTime(date: Date | string | null | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    return formatDate(d);
}

/**
 * Get current time formatted
 */
export function getCurrentDateTime(): string {
    return formatDateTime(new Date());
}

// ==================== NUMBER FORMATTERS ====================

/**
 * Format number with thousand separator
 * Example: 1000000 -> "1.000.000"
 */
export function formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return '-';
    return num.toLocaleString(DEFAULT_LOCALE);
}

/**
 * Format currency (Indonesian Rupiah)
 * Example: 1000000 -> "Rp 1.000.000"
 */
export function formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) return '-';
    return new Intl.NumberFormat(DEFAULT_LOCALE, {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format percentage
 * Example: 0.75 -> "75%"
 */
export function formatPercentage(value: number | null | undefined, decimals = 0): string {
    if (value === null || value === undefined) return '-';
    return `${(value * 100).toFixed(decimals)}%`;
}

// ==================== STRING FORMATTERS ====================

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string | null | undefined): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Format file size
 * Example: 1024 -> "1 KB"
 */
export function formatFileSize(bytes: number | null | undefined): string {
    if (bytes === null || bytes === undefined) return '-';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
