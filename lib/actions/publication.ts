'use server';

import { PublicationService } from '@/lib/services/publication.service';
import { revalidatePath } from 'next/cache';

export async function createPublication(data: {
    uploaderId: number;
    authorName: string;
    title: string;
    abstract?: string;
    link?: string;
    filePath?: string;
    publishDate?: Date;
}) {
    await PublicationService.create(data);
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}

export async function getPublications() {
    return PublicationService.getAll();
}

export async function deletePublication(id: number) {
    await PublicationService.delete(id);
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}

export async function incrementViewCount(id: number) {
    await PublicationService.incrementViewCount(id);
    revalidatePath('/publications');
    revalidatePath('/');
}

export async function getTopPublications(limit: number = 5) {
    return PublicationService.getTop(limit);
}
