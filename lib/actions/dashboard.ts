'use server';

import { db } from '@/db';
import { items, itemLoans, roomBookings, academicDocs, users, rooms } from '@/db/schema';
import { eq, and, gte, desc, sql } from 'drizzle-orm';

export async function getAdminStats() {
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

    // Get recent loans with manual joins
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

    // Get recent bookings with manual joins
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

export async function getStudentDashboard(userId: number) {
    const today = new Date();

    // Get active loans with manual joins
    const activeLoansRaw = await db
        .select({
            loan: itemLoans,
            item: items,
        })
        .from(itemLoans)
        .leftJoin(items, eq(itemLoans.itemId, items.id))
        .where(and(
            eq(itemLoans.studentId, userId),
            eq(itemLoans.status, 'Disetujui')
        ))
        .orderBy(itemLoans.returnPlanDate);

    // Get categories and rooms for items
    const activeLoans = await Promise.all(activeLoansRaw.map(async (row) => {
        const itemData = await db.query.items.findFirst({
            where: eq(items.id, row.item!.id),
            with: {
                category: true,
                room: true,
            },
        });
        return {
            ...row.loan,
            item: itemData!,
        };
    }));

    // Get upcoming bookings with manual joins
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

    // Get pending requests with manual joins
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

export async function getLecturerDashboard(userId: number) {
    const today = new Date();

    // Get upcoming bookings with manual joins
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

    // Get recent reports
    const recentReports = await db
        .select()
        .from(academicDocs)
        .where(eq(academicDocs.type, 'Laporan Praktikum'))
        .orderBy(desc(academicDocs.createdAt))
        .limit(10);

    return {
        upcomingBookings,
        recentReports,
        totalBookings: upcomingBookings.length,
    };
}
