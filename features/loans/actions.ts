'use server';

import { LoanService } from './service';
import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requirePermission } from '@/lib/auth';

/**
 * Get available items for borrowing
 */
export async function getAvailableItems(categoryId?: number) {
    return LoanService.getAvailableItems(categoryId);
}

/**
 * Create loan request with new fields
 */
export async function createLoanRequest(data: {
    studentId: number;
    itemId: number;
    returnPlanDate: Date;
    organisasi?: string;
    startTime?: Date;
    endTime?: Date;
    purpose?: string;
    suratIzin?: string;
    suratVerified?: boolean;
    dosenPembimbing?: string;
    software?: string[];
}) {
    // Ideally check session.user.id === data.studentId
    await LoanService.create(data);
    revalidatePath('/student/loans');
    revalidatePath('/student/items');
    revalidatePath('/admin/loans');
    revalidatePath('/admin/inventory');
}

/**
 * Get loan requests (for admin)
 */
export async function getLoanRequests(status?: string, startDate?: Date, endDate?: Date) {
    await requirePermission('loans.manage');
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
    await requirePermission('loans.manage');
    await LoanService.updateStatus(loanId, status, validatorId);
    revalidatePath('/admin/loans');
    revalidatePath('/student/loans');
    revalidatePath('/admin/inventory');
}

/**
 * Delete loan
 */
export async function deleteLoan(id: number) {
    await requirePermission('loans.manage');
    await LoanService.delete(id);
    revalidatePath('/admin/loans');
    revalidatePath('/admin/inventory');
}

/**
 * Get user's loans
 */
export async function getMyLoans(userId: number) {
    // Ideally check session.user.id === userId
    return LoanService.getByUserId(userId);
}

/**
 * Request item return (by student)
 * With photo: auto-approved, without photo: pending admin approval
 */
export async function requestItemReturn(loanId: number, returnPhoto?: string) {
    const result = await LoanService.requestReturn(loanId, returnPhoto);
    revalidatePath('/student/loans');
    revalidatePath('/student/items');
    revalidatePath('/admin/loans');
    revalidatePath('/admin/validations');
    revalidatePath('/admin/dashboard');
    return result;
}

/**
 * Approve pending return (by admin)
 */
export async function approveReturn(loanId: number, validatorId: number) {
    await requirePermission('loans.manage');
    await LoanService.approveReturn(loanId, validatorId);
    revalidatePath('/admin/loans');
    revalidatePath('/admin/validations');
    revalidatePath('/admin/inventory');
    revalidatePath('/student/loans');
}

/**
 * Reject pending return (by admin)
 */
export async function rejectReturn(loanId: number) {
    await requirePermission('loans.manage');
    await LoanService.rejectReturn(loanId);
    revalidatePath('/admin/loans');
    revalidatePath('/admin/validations');
    revalidatePath('/student/loans');
}

/**
 * Admin directly returns an item (without requiring student to submit return first)
 */
export async function adminDirectReturn(loanId: number, validatorId: number) {
    await requirePermission('loans.manage');
    await LoanService.adminDirectReturn(loanId, validatorId);
    revalidatePath('/admin/loans');
    revalidatePath('/admin/validations');
    revalidatePath('/admin/inventory');
    revalidatePath('/admin/pengembalian');
    revalidatePath('/student/loans');
}

/**
 * Get pending returns for admin
 */
export async function getPendingReturns() {
    await requirePermission('loans.manage');
    return LoanService.getPendingReturns();
}

/**
 * Get all lecturers for dropdown
 */
export async function getLecturersForLoan() {
    const { roles } = await import('@/db/schema');

    const lecturers = await db
        .select({
            id: users.id,
            fullName: users.fullName,
        })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(roles.name, 'Dosen'))
        .orderBy(users.fullName);

    return lecturers;
}

/**
 * Request item loan via QR scan
 */
export async function requestItemLoan(data: {
    itemId: number;
    studentId: number;
    purpose: string;
    returnPlanDate: Date;
    permitLetter?: string;
    permitVerified?: boolean;
}) {
    await LoanService.create({
        itemId: data.itemId,
        studentId: data.studentId,
        purpose: data.purpose,
        returnPlanDate: data.returnPlanDate,
        suratIzin: data.permitLetter,
        suratVerified: data.permitVerified,
    });
    revalidatePath('/student/loans');
    revalidatePath('/admin/loans');
    revalidatePath('/admin/inventory');
    revalidatePath('/items');
}

