/**
 * Dashboard Service
 * Business logic for dashboard statistics and data
 * 
 * UPDATED: Removed academic tables (assignments, practicalReports)
 * Now only handles inventory and bookings
 */

import { db } from '@/db';
import { items, itemLoans, roomBookings, users, rooms, itemCategories, governanceDocs } from '@/db/schema';
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
     * Kaprodi & Kepala Lab also see latest LPJ documents
     */
    static async getLecturerDashboard(userId: number, role?: string) {
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

        // Fetch LPJ documents for Kaprodi and Kepala Laboratorium
        let latestLPJ: { id: number; title: string; filePath: string; coverPath: string | null; createdAt: Date | null; uploaderName: string | null }[] = [];
        if (role === 'Kaprodi' || role === 'Kepala Laboratorium') {
            latestLPJ = await db
                .select({
                    id: governanceDocs.id,
                    title: governanceDocs.title,
                    filePath: governanceDocs.filePath,
                    coverPath: governanceDocs.coverPath,
                    createdAt: governanceDocs.createdAt,
                    uploaderName: users.fullName,
                })
                .from(governanceDocs)
                .leftJoin(users, eq(governanceDocs.adminId, users.id))
                .where(eq(governanceDocs.type, 'LPJ Bulanan'))
                .orderBy(desc(governanceDocs.createdAt))
                .limit(5);
        }

        return {
            upcomingBookings,
            totalBookings: upcomingBookings.length,
            latestLPJ,
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

    /**
     * Get loan trend data for last 7 days
     */
    static async getLoanTrendData() {
        const days = 7;
        const data: { date: string; count: number }[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);

            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);

            const result = await db
                .select({ count: sql<number>`count(*)` })
                .from(itemLoans)
                .where(and(
                    gte(itemLoans.requestDate, date),
                    sql`${itemLoans.requestDate} < ${nextDate}`
                ));

            data.push({
                date: date.toISOString(),
                count: result[0]?.count || 0
            });
        }

        return data;
    }

    /**
     * Get bookings by room for chart
     */
    static async getBookingsByRoom() {
        const result = await db
            .select({
                name: rooms.name,
                count: sql<number>`count(*)`,
            })
            .from(roomBookings)
            .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
            .groupBy(rooms.name)
            .orderBy(sql`count(*) DESC`)
            .limit(5);

        return result.map(r => ({
            name: r.name || 'Unknown',
            value: r.count
        }));
    }

    /**
     * Get loans by category for chart
     */
    static async getLoansByCategory() {
        const result = await db
            .select({
                name: itemCategories.name,
                count: sql<number>`count(*)`,
            })
            .from(itemLoans)
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .leftJoin(itemCategories, eq(items.categoryId, itemCategories.id))
            .groupBy(itemCategories.name)
            .orderBy(sql`count(*) DESC`)
            .limit(5);

        return result.map(r => ({
            name: r.name || 'Unknown',
            value: r.count
        }));
    }

    /**
     * Get idle items (not borrowed for 60+ days)
     */
    static async getIdleItemsCount() {
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(items)
            .where(and(
                eq(items.status, 'Tersedia'),
                sql`${items.id} NOT IN (
                    SELECT DISTINCT item_id FROM item_loans 
                    WHERE request_date >= ${sixtyDaysAgo}
                )`
            ));

        return result[0]?.count || 0;
    }

    /**
     * Get all pending counts for insights
     */
    static async getPendingCounts() {
        const [pendingLoans, pendingBookings, pendingUsers, publications] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(itemLoans).where(eq(itemLoans.status, 'Pending')),
            db.select({ count: sql<number>`count(*)` }).from(roomBookings).where(eq(roomBookings.status, 'Pending')),
            db.select({ count: sql<number>`count(*)` }).from(users).where(eq(users.status, 'Pending')),
            import('@/db/schema').then(async (schema) => {
                const result = await db
                    .select({ count: sql<number>`count(*)` })
                    .from(schema.publications)
                    .where(eq(schema.publications.status, 'Pending'));
                return result;
            })
        ]);

        return {
            pendingLoans: pendingLoans[0]?.count || 0,
            pendingBookings: pendingBookings[0]?.count || 0,
            pendingUsers: pendingUsers[0]?.count || 0,
            pendingPublications: publications[0]?.count || 0
        };
    }

    /**
     * Get recent bookings for peak hour detection
     */
    static async getRecentBookings(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const result = await db
            .select({ startTime: roomBookings.startTime })
            .from(roomBookings)
            .where(gte(roomBookings.startTime, startDate));

        return result;
    }

    /**
     * Get overdue loans (past return plan date but still active)
     */
    static async getOverdueLoans() {
        const now = new Date();
        const result = await db
            .select({
                id: itemLoans.id,
                studentName: users.fullName,
                itemName: items.name,
                returnPlanDate: itemLoans.returnPlanDate,
            })
            .from(itemLoans)
            .leftJoin(users, eq(itemLoans.studentId, users.id))
            .leftJoin(items, eq(itemLoans.itemId, items.id))
            .where(and(
                eq(itemLoans.status, 'Disetujui'),
                sql`${itemLoans.returnPlanDate} < ${now}`
            ));
        return result;
    }

    /**
     * Get loans with return deadlines in the next N days
     */
    static async getUpcomingDeadlines(days: number = 3) {
        const now = new Date();
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + days);
        const result = await db
            .select({ count: sql<number>`count(*)` })
            .from(itemLoans)
            .where(and(
                eq(itemLoans.status, 'Disetujui'),
                gte(itemLoans.returnPlanDate, now),
                sql`${itemLoans.returnPlanDate} <= ${deadline}`
            ));
        return result[0]?.count || 0;
    }

    /**
     * Get booking stats grouped by day of week (0=Sun..6=Sat)
     */
    static async getDayOfWeekStats() {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const result = await db
            .select({
                dayOfWeek: sql<number>`DAYOFWEEK(${roomBookings.startTime})`,
                count: sql<number>`count(*)`,
            })
            .from(roomBookings)
            .where(gte(roomBookings.startTime, thirtyDaysAgo))
            .groupBy(sql`DAYOFWEEK(${roomBookings.startTime})`);
        return result;
    }

    /**
     * Get room utilization: total bookings per room + item availability %
     */
    static async getRoomUtilization() {
        const [totalItems, unavailableItems, totalRooms, bookingCounts] = await Promise.all([
            db.select({ count: sql<number>`count(*)` }).from(items),
            db.select({ count: sql<number>`count(*)` }).from(items).where(
                sql`${items.status} != 'Tersedia'`
            ),
            db.select({ count: sql<number>`count(*)` }).from(rooms),
            db.select({
                roomName: rooms.name,
                count: sql<number>`count(*)`,
            })
                .from(roomBookings)
                .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
                .where(eq(roomBookings.status, 'Disetujui'))
                .groupBy(rooms.name)
                .orderBy(sql`count(*) DESC`)
                .limit(5),
        ]);

        const total = totalItems[0]?.count || 1;
        const unavail = unavailableItems[0]?.count || 0;

        return {
            itemAvailabilityRate: Math.round(((total - unavail) / total) * 100),
            unavailableItems: unavail,
            totalItems: total,
            totalRooms: totalRooms[0]?.count || 0,
            topRooms: bookingCounts,
        };
    }

    /**
     * Get loan trend data for last 14 days (extended for comparison)
     */
    static async getLoanTrend14Days() {
        const days = 14;
        const data: { date: string; count: number }[] = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            date.setHours(0, 0, 0, 0);
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const result = await db
                .select({ count: sql<number>`count(*)` })
                .from(itemLoans)
                .where(and(
                    gte(itemLoans.requestDate, date),
                    sql`${itemLoans.requestDate} < ${nextDate}`
                ));
            data.push({ date: date.toISOString(), count: result[0]?.count || 0 });
        }
        return data;
    }

    /**
     * Aggregate all smart analytics data in one call
     */
    static async getSmartAnalyticsData() {
        const [
            overdueLoans,
            upcomingDeadlines,
            dayOfWeekStats,
            roomUtilization,
            trendData14,
            idleItems,
            pendingCounts,
            recentBookings,
        ] = await Promise.all([
            this.getOverdueLoans(),
            this.getUpcomingDeadlines(3),
            this.getDayOfWeekStats(),
            this.getRoomUtilization(),
            this.getLoanTrend14Days(),
            this.getIdleItemsCount(),
            this.getPendingCounts(),
            this.getRecentBookings(30),
        ]);

        return {
            overdueLoans,
            upcomingDeadlines,
            dayOfWeekStats,
            roomUtilization,
            trendData14,
            idleItems,
            pendingCounts,
            recentBookings,
        };
    }
}
