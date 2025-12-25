/**
 * Booking Validators
 * Zod schemas for booking-related input validation
 */

import { z } from 'zod';

export const CreateBookingSchema = z.object({
    userId: z.number().positive('User ID harus positif'),
    roomId: z.number().positive('Room ID harus positif'),
    startTime: z.date(),
    endTime: z.date(),
    purpose: z.string().min(5, 'Tujuan peminjaman minimal 5 karakter'),
}).refine(
    (data) => data.endTime > data.startTime,
    { message: 'Waktu selesai harus setelah waktu mulai', path: ['endTime'] }
);

export const UpdateBookingStatusSchema = z.object({
    bookingId: z.number().positive('Booking ID harus positif'),
    status: z.enum(['Disetujui', 'Ditolak']),
    validatorId: z.number().positive('Validator ID harus positif'),
});

// Type exports
export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusSchema>;
