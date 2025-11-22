'use server';

import { db } from '@/db';
import { academicDocs, governanceDocs } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { saveFile, deleteFile } from '@/lib/upload';

// --- Academic Documents ---

export async function uploadAcademicDoc(formData: FormData) {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as 'Modul Praktikum' | 'Laporan Praktikum';
    const uploaderId = parseInt(formData.get('uploaderId') as string);

    if (!file) throw new Error('No file provided');

    // Save file and get path
    const filePath = await saveFile(file);

    // Save to database
    await db.insert(academicDocs).values({
        uploaderId,
        title,
        description: description || undefined,
        filePath,
        type,
    });

    revalidatePath('/admin/documents');
    revalidatePath('/student/academic');
}

export async function getAcademicDocs(type?: string) {
    const conditions = type ? eq(academicDocs.type, type as any) : undefined;

    return await db.query.academicDocs.findMany({
        where: conditions,
        orderBy: [desc(academicDocs.createdAt)],
    });
}

export async function deleteAcademicDoc(id: number) {
    const doc = await db.query.academicDocs.findFirst({
        where: eq(academicDocs.id, id),
    });

    if (!doc) throw new Error('Document not found');

    // Delete file from disk
    await deleteFile(doc.filePath);

    // Delete from database
    await db.delete(academicDocs).where(eq(academicDocs.id, id));

    revalidatePath('/admin/documents');
    revalidatePath('/student/academic');
}

// --- Governance Documents ---

export async function uploadGovernanceDoc(formData: FormData) {
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'SOP' | 'LPJ Bulanan';
    const adminId = parseInt(formData.get('adminId') as string);

    if (!file) throw new Error('No file provided');

    // Save file and get path
    const filePath = await saveFile(file);

    // Save to database
    await db.insert(governanceDocs).values({
        adminId,
        title,
        filePath,
        type,
    });

    revalidatePath('/admin/documents');
}

export async function getGovernanceDocs(type?: string) {
    const conditions = type ? eq(governanceDocs.type, type as any) : undefined;

    return await db.query.governanceDocs.findMany({
        where: conditions,
        orderBy: [desc(governanceDocs.createdAt)],
    });
}

export async function deleteGovernanceDoc(id: number) {
    const doc = await db.query.governanceDocs.findFirst({
        where: eq(governanceDocs.id, id),
    });

    if (!doc) throw new Error('Document not found');

    // Delete file from disk
    await deleteFile(doc.filePath);

    // Delete from database
    await db.delete(governanceDocs).where(eq(governanceDocs.id, id));

    revalidatePath('/admin/documents');
}
