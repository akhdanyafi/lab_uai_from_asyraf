'use server';

import { ScheduledPracticumService } from './service';
import { revalidatePath } from 'next/cache';
import { requireLabStaff, getSession } from '@/lib/auth';
import { createScheduledPracticumSchema, updateScheduledPracticumSchema } from './validator';
import type { CreateScheduledPracticumInput, UpdateScheduledPracticumInput } from './types';

/**
 * Get all scheduled practicums (optionally filtered by semester)
 */
export async function getScheduledPracticums(semester?: string) {
    return ScheduledPracticumService.getAll(semester);
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
export async function getScheduledPracticumsByRoom(roomId: number, semester?: string) {
    return ScheduledPracticumService.getByRoom(roomId, semester);
}

/**
 * Get all semesters
 */
export async function getScheduledPracticumSemesters() {
    return ScheduledPracticumService.getAllSemesters();
}

/**
 * Create new scheduled practicum (Admin / Kepala Lab only)
 */
export async function createScheduledPracticum(data: CreateScheduledPracticumInput) {
    const session = await requireLabStaff();
    const validated = createScheduledPracticumSchema.parse(data);

    await ScheduledPracticumService.create(validated as CreateScheduledPracticumInput, session.user.id);
    revalidatePath('/admin/scheduled-practicum');
    revalidatePath('/lecturer/scheduled-practicum');
    revalidatePath('/student/rooms');
}

/**
 * Update scheduled practicum (Admin / Kepala Lab only)
 */
export async function updateScheduledPracticum(id: number, data: UpdateScheduledPracticumInput) {
    await requireLabStaff();
    const validated = updateScheduledPracticumSchema.parse(data);

    await ScheduledPracticumService.update(id, validated as UpdateScheduledPracticumInput);
    revalidatePath('/admin/scheduled-practicum');
    revalidatePath('/lecturer/scheduled-practicum');
    revalidatePath('/student/rooms');
}

/**
 * Delete scheduled practicum (Admin / Kepala Lab only)
 */
export async function deleteScheduledPracticum(id: number) {
    await requireLabStaff();
    await ScheduledPracticumService.delete(id);
    revalidatePath('/admin/scheduled-practicum');
    revalidatePath('/lecturer/scheduled-practicum');
    revalidatePath('/student/rooms');
}
