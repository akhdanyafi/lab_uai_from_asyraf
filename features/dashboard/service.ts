/**
 * Dashboard Service
 * Business logic for dashboard statistics and data
 */

import { db } from '@/db';
import { items, itemLoans, roomBookings, practicalReports, users, rooms, itemCategories, modules, practicalSessions } from '@/db/schema';
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

        return {
            totalItems: totalItems[0].count,
            activeLoans: activeLoans[0].count,
            pendingLoans: pendingLoans[0].count,
            pendingBookings: pendingBookings[0].count,
            itemStats,
            recentLoans,
            recentBookings,
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

        const recentReportsRaw = await db
            .select({
                report: practicalReports,
                student: users,
                session: practicalSessions,
                module: modules,
            })
            .from(practicalReports)
            .leftJoin(users, eq(practicalReports.studentId, users.id))
            .leftJoin(practicalSessions, eq(practicalReports.sessionId, practicalSessions.id))
            .leftJoin(modules, eq(practicalSessions.moduleId, modules.id))
            .orderBy(desc(practicalReports.submissionDate))
            .limit(10);

        const recentReports = recentReportsRaw.map(row => ({
            ...row.report,
            student: row.student!,
            session: row.session!,
            module: row.module!,
        }));

        return {
            upcomingBookings,
            recentReports,
            totalBookings: upcomingBookings.length,
        };
    }
}
