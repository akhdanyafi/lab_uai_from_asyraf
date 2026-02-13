/**
 * Scheduled Practicum Validator
 */

import { z } from 'zod';

export const createScheduledPracticumSchema = z.object({
    courseId: z.coerce.number().min(1, 'Mata kuliah harus dipilih'),
    roomId: z.coerce.number().min(1, 'Ruangan harus dipilih'),
    moduleId: z.coerce.number().min(1, 'Modul harus dipilih').optional(),
    semester: z.string().min(1, 'Semester harus diisi'),
    dayOfWeek: z.coerce.number().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format waktu harus HH:MM'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Format waktu harus HH:MM'),
    scheduledDate: z.coerce.date(),
});

export const updateScheduledPracticumSchema = z.object({
    courseId: z.coerce.number().min(1).optional(),
    roomId: z.coerce.number().min(1).optional(),
    moduleId: z.coerce.number().nullable().optional(),
    dayOfWeek: z.coerce.number().min(0).max(6).optional(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    endTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
    scheduledDate: z.coerce.date().optional(),
    status: z.enum(['Aktif', 'Dibatalkan']).optional(),
});
