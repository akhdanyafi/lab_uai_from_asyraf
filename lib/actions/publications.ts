'use server';

import { db } from '@/db';
import { publications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
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
    await db.insert(publications).values(data);
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}

export async function getPublications() {
    return await db.select().from(publications).orderBy(desc(publications.publishDate));
}

export async function deletePublication(id: number) {
    await db.delete(publications).where(eq(publications.id, id));
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}
