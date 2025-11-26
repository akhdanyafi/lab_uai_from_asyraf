'use server';

import { db } from '@/db';
import { roomBookings, rooms } from '@/db/schema';
import { eq, and, desc, gte, lte, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

// Get all rooms
export async function getAllRooms() {
    return await db.select().from(rooms).orderBy(desc(rooms.id));
}

// Check room availability
export async function getRoomAvailability(roomId: number, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
        .select()
        .from(roomBookings)
        .where(and(
            eq(roomBookings.roomId, roomId),
            eq(roomBookings.status, 'Disetujui'),
            gte(roomBookings.startTime, startOfDay),
            lte(roomBookings.endTime, endOfDay)
        ))
        .orderBy(roomBookings.startTime);
}

// Create room booking request
export async function createRoomBooking(data: {
    userId: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
}) {
    await db.insert(roomBookings).values({
        userId: data.userId,
        roomId: data.roomId,
        startTime: data.startTime,
        endTime: data.endTime,
        purpose: data.purpose,
        status: 'Pending',
    });

    revalidatePath('/student/rooms');
    revalidatePath('/lecturer/rooms');
    revalidatePath('/admin/bookings');
}

// Get booking requests (for admin)
export async function getBookingRequests(status?: string) {
    const { users } = await import('@/db/schema');

    let query = db
        .select({
            booking: roomBookings,
            user: users,
            room: rooms,
        })
        .from(roomBookings)
        .leftJoin(users, eq(roomBookings.userId, users.id))
        .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
        .orderBy(desc(roomBookings.startTime));

    if (status) {
        query = query.where(eq(roomBookings.status, status as any)) as any;
    }

    const results = await query;

    return results.map(row => ({
        ...row.booking,
        user: row.user!,
        room: row.room!,
    }));
}

// Update booking status (admin approve/reject)
export async function updateBookingStatus(
    bookingId: number,
    status: 'Disetujui' | 'Ditolak',
    validatorId: number
) {
    await db.update(roomBookings)
        .set({ status, validatorId })
        .where(eq(roomBookings.id, bookingId));

    revalidatePath('/admin/bookings');
    revalidatePath('/student/rooms');
    revalidatePath('/lecturer/rooms');
}

// Get user's bookings
export async function getMyBookings(userId: number) {
    const results = await db
        .select({
            booking: roomBookings,
            room: rooms,
        })
        .from(roomBookings)
        .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
        .where(eq(roomBookings.userId, userId))
        .orderBy(desc(roomBookings.startTime));

    return results.map(row => ({
        ...row.booking,
        room: row.room!,
    }));
}

// Get bookings for a specific month (for calendar)
export async function getMonthBookings(month: number, year: number) {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const results = await db
        .select({
            booking: roomBookings,
            room: rooms,
        })
        .from(roomBookings)
        .leftJoin(rooms, eq(roomBookings.roomId, rooms.id))
        .where(and(
            eq(roomBookings.status, 'Disetujui'),
            gte(roomBookings.startTime, startDate),
            lte(roomBookings.endTime, endDate)
        ));

    return results.map(row => ({
        ...row.booking,
        room: row.room!,
    }));
}
