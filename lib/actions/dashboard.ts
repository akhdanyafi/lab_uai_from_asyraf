'use server';

import { DashboardService } from '@/lib/services/dashboard.service';

export async function getAdminStats() {
    return DashboardService.getAdminStats();
}

export async function getStudentDashboard(userId: number) {
    return DashboardService.getStudentDashboard(userId);
}

export async function getLecturerDashboard(userId: number) {
    return DashboardService.getLecturerDashboard(userId);
}
