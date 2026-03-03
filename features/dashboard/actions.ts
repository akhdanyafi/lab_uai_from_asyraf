'use server';

import { DashboardService } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';

export async function getAdminStats() {
    await requirePermission('dashboard.admin');
    return DashboardService.getAdminStats();
}

export async function getStudentDashboard(userId: string) {
    return DashboardService.getStudentDashboard(userId);
}

export async function getLecturerDashboard(userId: string, showLPJ: boolean = false) {
    return DashboardService.getLecturerDashboard(userId, showLPJ);
}

export async function markLoanNotificationRead(loanId: number) {
    await requirePermission('dashboard.admin');
    await DashboardService.markLoanNotificationRead(loanId);
    revalidatePath('/admin/dashboard');
}

export async function markBookingNotificationRead(bookingId: number) {
    await requirePermission('dashboard.admin');
    await DashboardService.markBookingNotificationRead(bookingId);
    revalidatePath('/admin/dashboard');
}

export async function markAllNotificationsRead() {
    await requirePermission('dashboard.admin');
    await DashboardService.markAllNotificationsRead();
    revalidatePath('/admin/dashboard');
}

// Analytics actions - admin only
export async function getLoanTrendData() {
    await requirePermission('dashboard.admin');
    return DashboardService.getLoanTrendData();
}

export async function getBookingsByRoom() {
    await requirePermission('dashboard.admin');
    return DashboardService.getBookingsByRoom();
}

export async function getLoansByCategory() {
    await requirePermission('dashboard.admin');
    return DashboardService.getLoansByCategory();
}

export async function getIdleItemsCount() {
    await requirePermission('dashboard.admin');
    return DashboardService.getIdleItemsCount();
}

export async function getPendingCounts() {
    await requirePermission('dashboard.admin');
    return DashboardService.getPendingCounts();
}

export async function getRecentBookings(days?: number) {
    await requirePermission('dashboard.admin');
    return DashboardService.getRecentBookings(days);
}

export async function getSmartAnalyticsData() {
    await requirePermission('dashboard.admin');
    return DashboardService.getSmartAnalyticsData();
}

