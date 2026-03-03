'use server';

import { PracticumService } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import type { CreateModuleInput, UpdateModuleInput } from './types';

/**
 * Get all practicum modules
 */
export async function getModules() {
    return PracticumService.getAll();
}

/**
 * Get modules for courses taught by a specific lecturer
 */
export async function getModulesByLecturerId(lecturerId: number) {
    return PracticumService.getByLecturerId(lecturerId);
}

/**
 * Get module by ID
 */
export async function getModuleById(id: number) {
    return PracticumService.getById(id);
}

/**
 * Search modules
 */
export async function searchModules(query: string) {
    return PracticumService.search(query);
}

/**
 * Get modules by course
 */
export async function getModulesByCourse(courseId: number) {
    return PracticumService.getByCourseId(courseId);
}

/**
 * Create new module
 */
export async function createModule(data: CreateModuleInput) {
    await requirePermission('practicum.manage');
    await PracticumService.create(data);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}

/**
 * Update module
 */
export async function updateModule(id: number, data: UpdateModuleInput) {
    await requirePermission('practicum.manage');
    await PracticumService.update(id, data);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}

/**
 * Delete module
 */
export async function deleteModule(id: number) {
    await requirePermission('practicum.manage');
    await PracticumService.delete(id);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}
