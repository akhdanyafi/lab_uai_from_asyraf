/**
 * Timezone Utility for LAB UAI
 * 
 * CONVENTION:
 * - Database stores all dates in UTC
 * - Application displays in WIB (Asia/Jakarta, UTC+7)
 * - Use these utilities for consistent timezone handling
 */

// WIB offset in minutes (UTC+7)
const WIB_OFFSET_MINUTES = 7 * 60;

/**
 * Get current time in WIB
 */
export function nowWIB(): Date {
    const now = new Date();
    const utcOffset = now.getTimezoneOffset();
    return new Date(now.getTime() + (WIB_OFFSET_MINUTES + utcOffset) * 60 * 1000);
}

/**
 * Get start of today in WIB, returned as UTC for DB queries
 */
export function startOfTodayWIB(): Date {
    const wibNow = nowWIB();
    const startOfDayWIB = new Date(wibNow.getFullYear(), wibNow.getMonth(), wibNow.getDate());
    // Convert back to UTC for database query
    return new Date(startOfDayWIB.getTime() - WIB_OFFSET_MINUTES * 60 * 1000);
}

/**
 * Get end of today in WIB, returned as UTC for DB queries
 */
export function endOfTodayWIB(): Date {
    const wibNow = nowWIB();
    const endOfDayWIB = new Date(wibNow.getFullYear(), wibNow.getMonth(), wibNow.getDate(), 23, 59, 59, 999);
    // Convert back to UTC for database query
    return new Date(endOfDayWIB.getTime() - WIB_OFFSET_MINUTES * 60 * 1000);
}

/**
 * Convert UTC date to WIB for display
 */
export function toWIB(utcDate: Date | string): Date {
    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    const utcOffset = date.getTimezoneOffset();
    return new Date(date.getTime() + (WIB_OFFSET_MINUTES + utcOffset) * 60 * 1000);
}

/**
 * Format date to WIB string (for display)
 */
export function formatWIB(utcDate: Date | string | null, options?: Intl.DateTimeFormatOptions): string {
    if (!utcDate) return '-';

    const defaultOptions: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        ...options
    };

    const date = typeof utcDate === 'string' ? new Date(utcDate) : utcDate;
    return date.toLocaleString('id-ID', defaultOptions);
}

/**
 * Format date and time to WIB string
 */
export function formatDateTimeWIB(utcDate: Date | string | null): string {
    if (!utcDate) return '-';
    return formatWIB(utcDate, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Format date only to WIB string
 */
export function formatDateWIB(utcDate: Date | string | null): string {
    if (!utcDate) return '-';
    return formatWIB(utcDate, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: undefined,
        minute: undefined
    });
}

/**
 * Format time only to WIB string
 */
export function formatTimeWIB(utcDate: Date | string | null): string {
    if (!utcDate) return '-';
    return formatWIB(utcDate, {
        hour: '2-digit',
        minute: '2-digit'
    });
}
