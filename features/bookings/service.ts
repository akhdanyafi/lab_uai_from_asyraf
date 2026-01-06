/**
 * Booking Service
 * Business logic for room bookings management
 */

import { db } from '@/db';
import { roomBookings, rooms, users } from '@/db/schema';
import { eq, and, desc, gte, lte } from 'drizzle-orm';

export interface CreateBookingInput {
    userId: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
    // New fields
    organisasi?: string;
    jumlahPeserta?: number;
    suratPermohonan?: string;
    dosenPembimbing?: string;
}

export class BookingService {
    /**
     * Get all rooms
     */
    static async getAllRooms() {
        return await db.select().from(rooms).orderBy(desc(rooms.id));
    }

    /**
     * Check room availability for a specific date
     */
    static async getRoomAvailability(roomId: number, date: Date) {
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

    /**
     * Create a new room booking request
     * Auto-validates if suratPermohonan is provided
     * Uses user's dosenPembimbing as fallback if not provided
     */
    static async create(data: CreateBookingInput) {
        // Auto-validate if surat permohonan is provided
        const status = data.suratPermohonan ? 'Disetujui' : 'Pending';

        // Get user's dosenPembimbing as fallback
        let finalDosenPembimbing: string | undefined = data.dosenPembimbing;
        if (!finalDosenPembimbing) {
            const user = await db
                .select({ dosenPembimbing: users.dosenPembimbing })
                .from(users)
                .where(eq(users.id, data.userId))
                .limit(1);
            finalDosenPembimbing = user[0]?.dosenPembimbing || undefined;
        }

        await db.insert(roomBookings).values({
            userId: data.userId,
            roomId: data.roomId,
            startTime: data.startTime,
            endTime: data.endTime,
            purpose: data.purpose,
            organisasi: data.organisasi || 'Pribadi',
            jumlahPeserta: data.jumlahPeserta || 1,
            suratPermohonan: data.suratPermohonan || null,
            dosenPembimbing: finalDosenPembimbing,
            status,
        });
    }

    /**
     * Get booking requests with optional status filter
     */
    static async getAll(status?: string) {
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

    /**
     * Update booking status (approve/reject)
     */
    static async updateStatus(
        bookingId: number,
        status: 'Disetujui' | 'Ditolak',
        validatorId: number
    ) {
        await db.update(roomBookings)
            .set({ status, validatorId })
            .where(eq(roomBookings.id, bookingId));
    }

    /**
     * Get user's bookings
     */
    static async getByUserId(userId: number) {
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

    /**
     * Get bookings for a specific month (for calendar)
     */
    static async getMonthBookings(month: number, year: number) {
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

    /**
     * Get rooms under maintenance
     */
    static async getMaintenanceRooms() {
        return await db.select().from(rooms).where(eq(rooms.status, 'Maintenance'));
    }
}
