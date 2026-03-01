'use server';

import { PublicationService, PublicationFilters } from './service';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';

// Admin/Dosen creates and publishes directly
export async function createPublication(data: {
    uploaderId: number;
    authorName: string;
    title: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
    publishYear?: number;
    publishMonth?: number;
    publishDay?: number;
}) {
    await requirePermission('publications.manage');
    await PublicationService.create(data);
    revalidatePath('/publications');
    revalidatePath('/admin/publications');
    revalidatePath('/lecturer/publications');
}

// Admin/Dosen updates a publication
export async function updatePublication(id: number, data: {
    title?: string;
    authorName?: string;
    abstract?: string;
    keywords?: string;
    link?: string;
    filePath?: string;
    publishYear?: number;
    publishMonth?: number | null;
    publishDay?: number | null;
}) {
    await requirePermission('publications.manage');
    await PublicationService.update(id, data);
    revalidatePath('/publications');
    revalidatePath('/admin/publications');
    revalidatePath('/lecturer/publications');
}

// Get publications for public view (with pagination)
export async function getPublicPublications(filters?: PublicationFilters) {
    return PublicationService.getPublished(filters);
}

// Get all publications for admin/dosen (with pagination)
export async function getPublications(filters?: PublicationFilters) {
    return PublicationService.getAll(filters);
}

// Get single publication
export async function getPublication(id: number) {
    return PublicationService.getById(id);
}

// Get all unique keywords
export async function getPublicationKeywords() {
    return PublicationService.getAllKeywords();
}

// Get all unique years
export async function getPublicationYears() {
    return PublicationService.getAllYears();
}

export async function deletePublication(id: number) {
    await requirePermission('publications.manage');
    await PublicationService.delete(id);
    revalidatePath('/publications');
    revalidatePath('/admin/publications');
    revalidatePath('/lecturer/publications');
}

export async function incrementViewCount(id: number) {
    await PublicationService.incrementViewCount(id);
    revalidatePath('/publications');
    revalidatePath('/');
}

export async function getTopPublications(limit: number = 5) {
    return PublicationService.getTop(limit);
}

// Like functionality
export async function togglePublicationLike(publicationId: number, userId: number) {
    const result = await PublicationService.toggleLike(publicationId, userId);
    revalidatePath('/publications');
    revalidatePath('/');
    return result;
}

export async function getPublicationLikeCount(publicationId: number) {
    return PublicationService.getLikeCount(publicationId);
}

export async function checkUserLikedPublication(publicationId: number, userId: number) {
    return PublicationService.checkUserLiked(publicationId, userId);
}

export async function getPublicationLikeCounts(publicationIds: number[]) {
    return PublicationService.getLikeCounts(publicationIds);
}

export async function getUserLikedPublicationIds(userId: number, publicationIds: number[]) {
    return PublicationService.getUserLikedIds(userId, publicationIds);
}
