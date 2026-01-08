'use server';

import { PublicationService, PublicationFilters } from './service';
import { revalidatePath } from 'next/cache';

// Admin creates and publishes directly
export async function createPublication(data: {
    uploaderId: number;
    authorName: string;
    title: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
    publishDate?: Date;
}) {
    await PublicationService.create(data);
    revalidatePath('/publications');
    revalidatePath('/admin/publications');
}

// User submits a draft for review
export async function submitPublication(data: {
    submitterId: number;
    authorName: string;
    title: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
}) {
    await PublicationService.submit(data);
    revalidatePath('/student/publications');
    revalidatePath('/admin/publications');
}

// Admin approves and publishes a pending submission
export async function approvePublication(id: number, uploaderId: number, updates?: {
    authorName?: string;
    title?: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
}) {
    await PublicationService.approve(id, uploaderId, updates);
    revalidatePath('/publications');
    revalidatePath('/student/publications');
    revalidatePath('/admin/publications');
}

// Admin rejects a pending submission
export async function rejectPublication(id: number) {
    await PublicationService.reject(id);
    revalidatePath('/student/publications');
    revalidatePath('/admin/publications');
    revalidatePath('/lecturer/publications');
}

// Admin/Lecturer updates a publication
export async function updatePublication(id: number, data: {
    title?: string;
    authorName?: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
}) {
    await PublicationService.update(id, data);
    revalidatePath('/publications');
    revalidatePath('/student/publications');
    revalidatePath('/admin/publications');
    revalidatePath('/lecturer/publications');
}

// Get published publications for public view
export async function getPublicPublications(filters?: PublicationFilters) {
    return PublicationService.getPublished(filters);
}

// Get all publications (admin)
export async function getPublications(filters?: PublicationFilters) {
    return PublicationService.getAll(filters);
}

// Get user's submissions
export async function getUserPublications(submitterId: number) {
    return PublicationService.getBySubmitter(submitterId);
}

// Get pending submissions for review
export async function getPendingPublications() {
    return PublicationService.getPending();
}

// Get single publication
export async function getPublication(id: number) {
    return PublicationService.getById(id);
}

// Get all unique keywords
export async function getPublicationKeywords() {
    return PublicationService.getAllKeywords();
}

export async function deletePublication(id: number) {
    await PublicationService.delete(id);
    revalidatePath('/publications');
    revalidatePath('/student/publications');
    revalidatePath('/admin/publications');
}

export async function incrementViewCount(id: number) {
    await PublicationService.incrementViewCount(id);
    revalidatePath('/publications');
    revalidatePath('/');
}

export async function getTopPublications(limit: number = 5) {
    return PublicationService.getTop(limit);
}

