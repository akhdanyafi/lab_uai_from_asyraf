'use server';

import { DashboardService } from './service';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function getAdminStats() {
    await requireAdmin();
    return DashboardService.getAdminStats();
}

export async function getStudentDashboard(userId: number) {
    return DashboardService.getStudentDashboard(userId);
}

export async function getLecturerDashboard(userId: number, role?: string) {
    return DashboardService.getLecturerDashboard(userId, role);
}

export async function markLoanNotificationRead(loanId: number) {
    await requireAdmin();
    await DashboardService.markLoanNotificationRead(loanId);
    revalidatePath('/admin/dashboard');
}

export async function markBookingNotificationRead(bookingId: number) {
    await requireAdmin();
    await DashboardService.markBookingNotificationRead(bookingId);
    revalidatePath('/admin/dashboard');
}

export async function markAllNotificationsRead() {
    await requireAdmin();
    await DashboardService.markAllNotificationsRead();
    revalidatePath('/admin/dashboard');
}

// Analytics actions - admin only
export async function getLoanTrendData() {
    await requireAdmin();
    return DashboardService.getLoanTrendData();
}

export async function getBookingsByRoom() {
    await requireAdmin();
    return DashboardService.getBookingsByRoom();
}

export async function getLoansByCategory() {
    await requireAdmin();
    return DashboardService.getLoansByCategory();
}

export async function getIdleItemsCount() {
    await requireAdmin();
    return DashboardService.getIdleItemsCount();
}

export async function getPendingCounts() {
    await requireAdmin();
    return DashboardService.getPendingCounts();
}

export async function getRecentBookings(days?: number) {
    await requireAdmin();
    return DashboardService.getRecentBookings(days);
}

export async function getSmartAnalyticsData() {
    await requireAdmin();
    return DashboardService.getSmartAnalyticsData();
}

