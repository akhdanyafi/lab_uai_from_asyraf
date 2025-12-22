'use server';

import { BookingService } from '@/lib/services/booking.service';
import { revalidatePath } from 'next/cache';

/**
 * Get all rooms
 */
export async function getAllRooms() {
    return BookingService.getAllRooms();
}

/**
 * Check room availability
 */
export async function getRoomAvailability(roomId: number, date: Date) {
    return BookingService.getRoomAvailability(roomId, date);
}

/**
 * Create room booking request
 */
export async function createRoomBooking(data: {
    userId: number;
    roomId: number;
    startTime: Date;
    endTime: Date;
    purpose: string;
}) {
    await BookingService.create(data);
    revalidatePath('/student/rooms');
    revalidatePath('/lecturer/rooms');
    revalidatePath('/admin/bookings');
}

/**
 * Get booking requests (for admin)
 */
export async function getBookingRequests(status?: string) {
    return BookingService.getAll(status);
}

/**
 * Update booking status (admin approve/reject)
 */
export async function updateBookingStatus(
    bookingId: number,
    status: 'Disetujui' | 'Ditolak',
    validatorId: number
) {
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
