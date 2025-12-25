'use server';

import { LoanService } from './service';
import { revalidatePath } from 'next/cache';

/**
 * Get available items for borrowing
 */
export async function getAvailableItems(categoryId?: number) {
    return LoanService.getAvailableItems(categoryId);
}

/**
 * Create loan request
 */
export async function createLoanRequest(data: {
    studentId: number;
    itemId: number;
    returnPlanDate: Date;
}) {
    await LoanService.create(data);
    revalidatePath('/student/loans');
    revalidatePath('/admin/loans');
}

/**
 * Get loan requests (for admin)
 */
export async function getLoanRequests(status?: string, startDate?: Date, endDate?: Date) {
    return LoanService.getAll({ status, startDate, endDate });
}

/**
 * Update loan status (admin approve/reject)
 */
export async function updateLoanStatus(
    loanId: number,
    status: 'Disetujui' | 'Ditolak',
    validatorId: number
) {
    await LoanService.updateStatus(loanId, status, validatorId);
    revalidatePath('/admin/loans');
    revalidatePath('/student/loans');
    revalidatePath('/admin/inventory');
}

/**
 * Get user's loans
 */
export async function getMyLoans(userId: number) {
    return LoanService.getByUserId(userId);
}

/**
 * Mark item as returned
 */
export async function returnItem(loanId: number) {
    await LoanService.returnItem(loanId);
    revalidatePath('/student/loans');
    revalidatePath('/admin/loans');
    revalidatePath('/admin/inventory');
}
