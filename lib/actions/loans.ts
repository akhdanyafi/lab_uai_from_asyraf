'use server';

import { db } from '@/db';
import { itemLoans, items, itemCategories, rooms, users } from '@/db/schema';
import { eq, and, desc, or, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Get available items for borrowing
export async function getAvailableItems() {
    const results = await db
        .select({
            item: items,
            category: itemCategories,
            room: rooms,
        })
        .from(items)
        .leftJoin(itemCategories, eq(items.categoryId, itemCategories.id))
        .leftJoin(rooms, eq(items.roomId, rooms.id))
        .where(eq(items.status, 'Tersedia'))
        .orderBy(desc(items.id));

    return results.map(row => ({
        ...row.item,
        category: row.category!,
        room: row.room!,
    }));
}

// Create loan request
export async function createLoanRequest(data: {
    studentId: number;
    itemId: number;
    returnPlanDate: Date;
}) {
    await db.insert(itemLoans).values({
        studentId: data.studentId,
        itemId: data.itemId,
        returnPlanDate: data.returnPlanDate,
        status: 'Pending',
    });
    revalidatePath('/student/loans');
    revalidatePath('/admin/loans');
}

// Get loan requests (for admin)
export async function getLoanRequests(status?: string, startDate?: Date, endDate?: Date) {
    let query = db
        .select({
            loan: itemLoans,
            student: users,
            item: items,
            category: itemCategories,
            room: rooms,
        })
        .from(itemLoans)
        .leftJoin(users, eq(itemLoans.studentId, users.id))
        .leftJoin(items, eq(itemLoans.itemId, items.id))
        .leftJoin(itemCategories, eq(items.categoryId, itemCategories.id))
        .leftJoin(rooms, eq(items.roomId, rooms.id))
        .orderBy(desc(itemLoans.requestDate));

    const conditions = [];

    if (status) {
        conditions.push(eq(itemLoans.status, status as any));
    }

    if (startDate) {
        // Ensure startDate is at the beginning of the day
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        conditions.push(sql`${itemLoans.requestDate} >= ${start}`);
    }

    if (endDate) {
        // Ensure endDate is at the end of the day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        conditions.push(sql`${itemLoans.requestDate} <= ${end}`);
    }

    if (conditions.length > 0) {
        query = query.where(and(...conditions)) as any;
    }

    const results = await query;

    return results.map(row => ({
        ...row.loan,
        student: row.student!,
        item: {
            ...row.item!,
            category: row.category!,
            room: row.room!,
        },
    }));
}

// Update loan status (admin approve/reject)
export async function updateLoanStatus(
    loanId: number,
    status: 'Disetujui' | 'Ditolak',
    validatorId: number
) {
    const loanResult = await db
        .select()
        .from(itemLoans)
        .where(eq(itemLoans.id, loanId))
        .limit(1);

    const loan = loanResult[0];
    if (!loan) throw new Error('Loan not found');

    // Update loan status
    await db.update(itemLoans)
        .set({ status, validatorId })
        .where(eq(itemLoans.id, loanId));

    // If approved, update item status to "Dipinjam"
    if (status === 'Disetujui') {
        await db.update(items)
            .set({ status: 'Dipinjam' })
            .where(eq(items.id, loan.itemId));
    }

    revalidatePath('/admin/loans');
    revalidatePath('/student/loans');
    revalidatePath('/admin/inventory');
}

// Get user's loans
export async function getMyLoans(userId: number) {
    const results = await db
        .select({
            loan: itemLoans,
            item: items,
            category: itemCategories,
            room: rooms,
        })
        .from(itemLoans)
        .leftJoin(items, eq(itemLoans.itemId, items.id))
        .leftJoin(itemCategories, eq(items.categoryId, itemCategories.id))
        .leftJoin(rooms, eq(items.roomId, rooms.id))
        .where(eq(itemLoans.studentId, userId))
        .orderBy(desc(itemLoans.requestDate));

    return results.map(row => ({
        ...row.loan,
        item: {
            ...row.item!,
            category: row.category!,
            room: row.room!,
        },
    }));
}

// Mark item as returned
export async function returnItem(loanId: number) {
    const loanResult = await db
        .select()
        .from(itemLoans)
        .where(eq(itemLoans.id, loanId))
        .limit(1);

    const loan = loanResult[0];
    if (!loan) throw new Error('Loan not found');

    // Update loan status to "Selesai"
    await db.update(itemLoans)
        .set({
            status: 'Selesai',
            actualReturnDate: new Date(),
        })
        .where(eq(itemLoans.id, loanId));

    // Update item status back to "Tersedia"
    await db.update(items)
        .set({ status: 'Tersedia' })
        .where(eq(items.id, loan.itemId));

    revalidatePath('/student/loans');
    revalidatePath('/admin/loans');
    revalidatePath('/admin/inventory');
}
