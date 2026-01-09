'use server';

import { DashboardService } from './service';
import { revalidatePath } from 'next/cache';

export async function getAdminStats() {
    return DashboardService.getAdminStats();
}

export async function getStudentDashboard(userId: number) {
    return DashboardService.getStudentDashboard(userId);
}

export async function getLecturerDashboard(userId: number) {
    return DashboardService.getLecturerDashboard(userId);
}

export async function markLoanNotificationRead(loanId: number) {
    await DashboardService.markLoanNotificationRead(loanId);
    revalidatePath('/admin/dashboard');
}

export async function markBookingNotificationRead(bookingId: number) {
    await DashboardService.markBookingNotificationRead(bookingId);
    revalidatePath('/admin/dashboard');
}

export async function markAllNotificationsRead() {
    await DashboardService.markAllNotificationsRead();
    revalidatePath('/admin/dashboard');
}
