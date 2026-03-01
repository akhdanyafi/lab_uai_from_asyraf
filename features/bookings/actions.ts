'use server';

import { BookingService } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';

/**
 * Get all rooms
 */
export async function getAllRooms() {
    return BookingService.getAllRooms();
}

/**
 * Get all lecturers for dosen pembimbing dropdown
 */
export async function getLecturers() {
    const { db } = await import('@/db');
    const { users, roles } = await import('@/db/schema');
    const { eq } = await import('drizzle-orm');

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
 * Check room availability
 */
export async function getRoomAvailability(roomId: number, date: Date) {
    return BookingService.getRoomAvailability(roomId, date);
}

/**
 * Create room booking request
 * Auto-validates if suratPermohonan is provided
 */
export async function createRoomBooking(data: {
    userId: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
    organisasi?: string;
    jumlahPeserta?: number;
    suratPermohonan?: string;
    suratVerified?: boolean;
    dosenPembimbing?: string;
}) {
    // Ideally check session.user.id === data.userId
    await BookingService.create(data);
    revalidatePath('/student/rooms');
    revalidatePath('/lecturer/rooms');
    revalidatePath('/admin/bookings');
}

/**
 * Get booking requests (for admin)
 */
export async function getBookingRequests(status?: string, startDate?: Date, endDate?: Date) {
    await requirePermission('bookings.manage');
    return BookingService.getAll({ status, startDate, endDate });
}

/**
 * Delete booking
 */
export async function deleteBooking(id: number) {
    await requirePermission('bookings.manage');
    await BookingService.delete(id);
    revalidatePath('/admin/bookings');
}

/**
 * Update booking status (admin approve/reject)
 */
export async function updateBookingStatus(
    bookingId: number,
    status: 'Disetujui' | 'Ditolak',
    validatorId: number
) {
    await requirePermission('bookings.manage');
    await BookingService.updateStatus(bookingId, status, validatorId);
    revalidatePath('/admin/bookings');
    revalidatePath('/student/rooms');
    revalidatePath('/lecturer/rooms');
}

/**
 * Get user's bookings
 */
export async function getMyBookings(userId: number) {
    return BookingService.getByUserId(userId);
}

/**
 * Get bookings for a specific month (for calendar)
 */
export async function getMonthBookings(month: number, year: number) {
    return BookingService.getMonthBookings(month, year);
}

/**
 * Get rooms under maintenance
 */
export async function getMaintenanceRooms() {
    return BookingService.getMaintenanceRooms();
}

/**
 * Get scheduled practicums for calendar display
 */
export async function getScheduledPracticumsForCalendar() {
    return BookingService.getScheduledPracticumsForCalendar();
}
