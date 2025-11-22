'use server';

import { db } from '@/db';
import { studentPublications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function createPublication(data: {
    studentId: number;
    title: string;
    abstract?: string;
    link?: string;
    publishDate?: Date;
}) {
    await db.insert(studentPublications).values(data);
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}

export async function getPublications() {
    return await db.query.studentPublications.findMany({
        orderBy: [desc(studentPublications.publishDate)],
    });
}

export async function deletePublication(id: number) {
    await db.delete(studentPublications).where(eq(studentPublications.id, id));
    revalidatePath('/student/publications');
    revalidatePath('/publications');
}
