'use server';

import { PracticumService } from './service';
import { revalidatePath } from 'next/cache';
import type { CreateModuleInput, UpdateModuleInput } from './types';

/**
 * Get all practicum modules
 */
export async function getModules() {
    return PracticumService.getAll();
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
 * Get all unique subjects
 */
export async function getAllSubjects() {
    return PracticumService.getAllSubjects();
}

/**
 * Create new module
 */
export async function createModule(data: CreateModuleInput) {
    await PracticumService.create(data);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}

/**
 * Update module
 */
export async function updateModule(id: number, data: UpdateModuleInput) {
    await PracticumService.update(id, data);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}

/**
 * Delete module
 */
export async function deleteModule(id: number) {
    await PracticumService.delete(id);
    revalidatePath('/admin/practicum');
    revalidatePath('/lecturer/practicum');
    revalidatePath('/student/practicum');
}
