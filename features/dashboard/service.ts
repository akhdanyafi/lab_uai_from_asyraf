/**
 * Dashboard Service
 * Business logic for dashboard statistics and data
 * 
 * UPDATED: Removed academic tables (assignments, practicalReports)
 * Now only handles inventory and bookings
 */

import { db } from '@/db';
import { items, itemLoans, roomBookings, users, rooms, itemCategories } from '@/db/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';

export class DashboardService {
    /**
     * Get admin dashboard statistics
     */
    static async getAdminStats() {
        const [
            totalItems,
            activeLoans,
            pendingLoans,
            pendingBookings,
            itemStats
        ] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(items),
            db.select({ count: sql<number>`count(*)` }).from(itemLoans).where(eq(itemLoans.status, 'Disetujui')),
            db.select({ count: sql<number>`count(*)` }).from(itemLoans).where(eq(itemLoans.status, 'Pending')),
            db.select({ count: sql<number>`count(*)` }).from(roomBookings).where(eq(roomBookings.status, 'Pending')),
            db.select({
                status: items.status,
                count: sql<number>`count(*)`,
            })
                .from(items)
                .groupBy(items.status),
        ]);

        const recentLoansRaw = await db
            .select({
                loan: itemLoans,
                student: users,
                item: items,
            })
            .from(itemLoans)
            .leftJoin(users, eq(itemLoans.studentId, users.id))
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .orderBy(desc(itemLoans.requestDate))
            .limit(5);

        const recentLoans = recentLoansRaw.map(row => ({
            ...row.loan,
            student: row.student!,
            item: row.item!,
        }));

        const recentBookingsRaw = await db
            .select({
                booking: roomBookings,
                user: users,
                room: rooms,
            })
            .from(roomBookings)
            .leftJoin(users, eq(roomBookings.userId, users.id))
            .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
            .orderBy(desc(roomBookings.startTime))
            .limit(5);

        const recentBookings = recentBookingsRaw.map(row => ({
            ...row.booking,
            user: row.user!,
            room: row.room!,
        }));

        // Auto-approved loans (with surat izin) - for notifications (only unread)
        const autoApprovedLoansRaw = await db
            .select({
                loan: itemLoans,
                student: users,
                item: items,
            })
            .from(itemLoans)
            .leftJoin(users, eq(itemLoans.studentId, users.id))
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .where(and(
                eq(itemLoans.status, 'Disetujui'),
                eq(itemLoans.notificationRead, '0'),
                sql`${itemLoans.suratIzin} IS NOT NULL AND ${itemLoans.suratIzin} != ''`
            ))
            .orderBy(desc(itemLoans.requestDate))
            .limit(10);

        const autoApprovedLoans = autoApprovedLoansRaw.map(row => ({
            ...row.loan,
            student: row.student!,
            item: row.item!,
        }));

        // Auto-approved bookings (with surat permohonan) - for notifications (only unread)
        const autoApprovedBookingsRaw = await db
            .select({
                booking: roomBookings,
                user: users,
                room: rooms,
            })
            .from(roomBookings)
            .leftJoin(users, eq(roomBookings.userId, users.id))
            .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
            .where(and(
                eq(roomBookings.status, 'Disetujui'),
                eq(roomBookings.notificationRead, '0'),
                sql`${roomBookings.suratPermohonan} IS NOT NULL AND ${roomBookings.suratPermohonan} != ''`
            ))
            .orderBy(desc(roomBookings.startTime))
            .limit(10);

        const autoApprovedBookings = autoApprovedBookingsRaw.map(row => ({
            ...row.booking,
            user: row.user!,
            room: row.room!,
        }));

        // Auto-returned loans (with return photo) - for notifications (only unread)
        const autoReturnedLoansRaw = await db
            .select({
                loan: itemLoans,
                student: users,
                item: items,
            })
            .from(itemLoans)
            .leftJoin(users, eq(itemLoans.studentId, users.id))
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .where(and(
                eq(itemLoans.returnStatus, 'Dikembalikan'),
                eq(itemLoans.returnNotificationRead, '0'),
                sql`${itemLoans.returnPhoto} IS NOT NULL AND ${itemLoans.returnPhoto} != ''`
            ))
            .orderBy(desc(itemLoans.actualReturnDate))
            .limit(10);

        const autoReturnedLoans = autoReturnedLoansRaw.map(row => ({
            ...row.loan,
            student: row.student!,
            item: row.item!,
        }));

        // Count pending returns for admin
        const pendingReturns = await db.select({ count: sql<number>`count(*)` })
            .from(itemLoans)
            .where(eq(itemLoans.returnStatus, 'Pending'));

        return {
            totalItems: totalItems[0].count,
            activeLoans: activeLoans[0].count,
            pendingLoans: pendingLoans[0].count,
            pendingBookings: pendingBookings[0].count,
            pendingReturns: pendingReturns[0].count,
            itemStats,
            recentLoans,
            recentBookings,
            autoApprovedLoans,
            autoApprovedBookings,
            autoReturnedLoans,
        };
    }

    /**
     * Get student dashboard data
     */
    static async getStudentDashboard(userId: number) {
        const today = new Date();

        const activeLoansRaw = await db
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
            .where(and(
                eq(itemLoans.studentId, userId),
                eq(itemLoans.status, 'Disetujui')
            ))
            .orderBy(itemLoans.returnPlanDate);

        const activeLoans = activeLoansRaw.map(row => ({
            ...row.loan,
            item: {
                ...row.item!,
                category: row.category!,
                room: row.room!,
            },
        }));

        const upcomingBookingsRaw = await db
            .select({
                booking: roomBookings,
                room: rooms,
            })
            .from(roomBookings)
            .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
            .where(and(
                eq(roomBookings.userId, userId),
                eq(roomBookings.status, 'Disetujui'),
                gte(roomBookings.startTime, today)
            ))
            .orderBy(roomBookings.startTime)
            .limit(5);

        const upcomingBookings = upcomingBookingsRaw.map(row => ({
            ...row.booking,
            room: row.room!,
        }));

        const pendingRequestsRaw = await db
            .select({
                loan: itemLoans,
                item: items,
            })
            .from(itemLoans)
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .where(and(
                eq(itemLoans.studentId, userId),
                eq(itemLoans.status, 'Pending')
            ));

        const pendingRequests = pendingRequestsRaw.map(row => ({
            ...row.loan,
            item: row.item!,
        }));

        return {
            activeLoans,
            upcomingBookings,
            pendingRequests,
        };
    }

    /**
     * Get lecturer dashboard data
     */
    static async getLecturerDashboard(userId: number) {
        const today = new Date();

        const upcomingBookingsRaw = await db
            .select({
                booking: roomBookings,
                room: rooms,
            })
            .from(roomBookings)
            .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
            .where(and(
                eq(roomBookings.userId, userId),
                gte(roomBookings.startTime, today)
            ))
            .orderBy(roomBookings.startTime)
            .limit(10);

        const upcomingBookings = upcomingBookingsRaw.map(row => ({
            ...row.booking,
            room: row.room!,
        }));

        return {
            upcomingBookings,
            totalBookings: upcomingBookings.length,
        };
    }

    /**
     * Mark loan notification as read
     */
    static async markLoanNotificationRead(loanId: number) {
        await db.update(itemLoans)
            .set({ notificationRead: '1' })
            .where(eq(itemLoans.id, loanId));
    }

    /**
     * Mark booking notification as read
     */
    static async markBookingNotificationRead(bookingId: number) {
        await db.update(roomBookings)
            .set({ notificationRead: '1' })
            .where(eq(roomBookings.id, bookingId));
    }

    /**
     * Mark all notifications as read (including return notifications)
     */
    static async markAllNotificationsRead() {
        await Promise.all([
            // Auto-approved loan notifications
            db.update(itemLoans)
                .set({ notificationRead: '1' })
                .where(and(
                    eq(itemLoans.status, 'Disetujui'),
                    eq(itemLoans.notificationRead, '0'),
                    sql`${itemLoans.suratIzin} IS NOT NULL AND ${itemLoans.suratIzin} != ''`
                )),
            // Auto-approved booking notifications
            db.update(roomBookings)
                .set({ notificationRead: '1' })
                .where(and(
                    eq(roomBookings.status, 'Disetujui'),
                    eq(roomBookings.notificationRead, '0'),
                    sql`${roomBookings.suratPermohonan} IS NOT NULL AND ${roomBookings.suratPermohonan} != ''`
                )),
            // Auto-returned loan notifications
            db.update(itemLoans)
                .set({ returnNotificationRead: '1' })
                .where(and(
                    eq(itemLoans.returnStatus, 'Dikembalikan'),
                    eq(itemLoans.returnNotificationRead, '0'),
                    sql`${itemLoans.returnPhoto} IS NOT NULL AND ${itemLoans.returnPhoto} != ''`
                ))
        ]);
    }
}

