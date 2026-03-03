'use server';

import { ScheduledPracticumService } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission, getSession } from '@/lib/auth';
import { createScheduledPracticumSchema, updateScheduledPracticumSchema } from './validator';
import type { CreateScheduledPracticumInput, UpdateScheduledPracticumInput } from './types';

/**
 * Get all scheduled practicums
 */
export async function getScheduledPracticums() {
    return ScheduledPracticumService.getAll();
}

/**
 * Get scheduled practicums for a specific lecturer's courses
 */
export async function getScheduledPracticumsByLecturerId(lecturerId: number) {
    return ScheduledPracticumService.getByLecturerId(lecturerId);
}

/**
 * Get scheduled practicum by ID
 */
export async function getScheduledPracticumById(id: number) {
    return ScheduledPracticumService.getById(id);
}

/**
 * Get scheduled practicums by room
 */
export async function getScheduledPracticumsByRoom(roomId: number) {
    return ScheduledPracticumService.getByRoom(roomId);
}

/**
 * Create new scheduled practicum
 */
export async function createScheduledPracticum(data: CreateScheduledPracticumInput) {
    try {
        const session = await requirePermission('practicum.manage');
        const validated = createScheduledPracticumSchema.parse(data);

        await ScheduledPracticumService.create(validated as CreateScheduledPracticumInput, session.user.id);
        revalidatePath('/admin/scheduled-practicum');
        revalidatePath('/lecturer/scheduled-practicum');
        revalidatePath('/student/scheduled-practicum');
        revalidatePath('/student/rooms');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Gagal membuat jadwal praktikum' };
    }
}

/**
 * Update scheduled practicum
 */
export async function updateScheduledPracticum(id: number, data: UpdateScheduledPracticumInput) {
    try {
        await requirePermission('practicum.manage');
        const validated = updateScheduledPracticumSchema.parse(data);

        await ScheduledPracticumService.update(id, validated as UpdateScheduledPracticumInput);
        revalidatePath('/admin/scheduled-practicum');
        revalidatePath('/lecturer/scheduled-practicum');
        revalidatePath('/student/scheduled-practicum');
        revalidatePath('/student/rooms');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Gagal memperbarui jadwal praktikum' };
    }
}

/**
 * Delete scheduled practicum
 */
export async function deleteScheduledPracticum(id: number) {
    try {
        await requirePermission('practicum.manage');
        await ScheduledPracticumService.delete(id);
        revalidatePath('/admin/scheduled-practicum');
        revalidatePath('/lecturer/scheduled-practicum');
        revalidatePath('/student/scheduled-practicum');
        revalidatePath('/student/rooms');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || 'Gagal menghapus jadwal praktikum' };
    }
}
