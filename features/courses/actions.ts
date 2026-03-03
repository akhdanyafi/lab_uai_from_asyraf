'use server';

import { CourseService } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import type { CreateCourseInput, UpdateCourseInput } from './types';

/**
 * Get all courses
 */
export async function getCourses() {
    return CourseService.getAll();
}

/**
 * Get courses for a specific lecturer
 */
export async function getCoursesByLecturerId(lecturerId: number) {
    return CourseService.getByLecturerId(lecturerId);
}

/**
 * Get course by ID
 */
export async function getCourseById(id: number) {
    return CourseService.getById(id);
}

/**
 * Search courses
 */
export async function searchCourses(query: string) {
    return CourseService.search(query);
}

/**
 * Get all semesters
 */
export async function getAllSemesters() {
    return CourseService.getAllSemesters();
}

/**
 * Create new course (Admin / Kepala Lab only)
 */
export async function createCourse(data: CreateCourseInput) {
    await requirePermission('courses.manage');
    await CourseService.create(data);
    revalidatePath('/admin/courses');
    revalidatePath('/lecturer/courses');
}

/**
 * Update course (Admin / Kepala Lab only)
 */
export async function updateCourse(id: number, data: UpdateCourseInput) {
    await requirePermission('courses.manage');
    await CourseService.update(id, data);
    revalidatePath('/admin/courses');
    revalidatePath('/lecturer/courses');
}

/**
 * Assign lecturer to course (Admin / Kepala Lab only)
 */
export async function assignLecturerToCourse(courseId: number, lecturerId: number | null) {
    await requirePermission('courses.manage');
    await CourseService.assignLecturer(courseId, lecturerId);
    revalidatePath('/admin/courses');
    revalidatePath('/lecturer/courses');
}

/**
 * Delete course (Admin / Kepala Lab only)
 */
export async function deleteCourse(id: number) {
    await requirePermission('courses.manage');
    await CourseService.delete(id);
    revalidatePath('/admin/courses');
    revalidatePath('/lecturer/courses');
}
