'use server';

import { db } from '@/db';
import { governanceDocs, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';

export async function getGovernanceDocs(type: string) {
    const docs = await db
        .select({
            id: governanceDocs.id,
            title: governanceDocs.title,
            filePath: governanceDocs.filePath,
            coverPath: governanceDocs.coverPath,
            type: governanceDocs.type,
            createdAt: governanceDocs.createdAt,
            uploaderName: users.fullName,
        })
        .from(governanceDocs)
        .leftJoin(users, eq(governanceDocs.adminId, users.id))
        .where(eq(governanceDocs.type, type as any))
        .orderBy(desc(governanceDocs.createdAt));

    return docs;
}

export async function uploadGovernanceDoc(formData: FormData) {
    const file = formData.get('file') as File;
    const coverFile = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'SOP' | 'LPJ Bulanan';
    const adminId = parseInt(formData.get('adminId') as string);

    if (!file) {
        throw new Error('No file uploaded');
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'governance');
    await mkdir(uploadDir, { recursive: true });

    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = join(uploadDir, filename);

    await writeFile(filePath, buffer);

    // Handle Cover Image
    let coverPath = null;
    if (coverFile && coverFile.size > 0) {
        const coverBytes = await coverFile.arrayBuffer();
        const coverBuffer = Buffer.from(coverBytes);
        const coverFilename = `cover-${uniqueSuffix}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const coverFilePath = join(uploadDir, coverFilename);
        await writeFile(coverFilePath, coverBuffer);
        coverPath = `/uploads/governance/${coverFilename}`;
    }

    await db.insert(governanceDocs).values({
        adminId,
        title,
        filePath: `/uploads/governance/${filename}`,
        coverPath,
        type,
    });

    revalidatePath('/admin/governance');
    revalidatePath('/');
}

export async function updateGovernanceDoc(id: number, formData: FormData) {
    const file = formData.get('file') as File | null;
    const coverFile = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'SOP' | 'LPJ Bulanan';

    const updateData: any = {
        title,
        type,
    };

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'governance');
    await mkdir(uploadDir, { recursive: true });
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;

    if (file && file.size > 0) {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);
        updateData.filePath = `/uploads/governance/${filename}`;
    }

    if (coverFile && coverFile.size > 0) {
        const coverBytes = await coverFile.arrayBuffer();
        const coverBuffer = Buffer.from(coverBytes);
        const coverFilename = `cover-${uniqueSuffix}-${coverFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const coverFilePath = join(uploadDir, coverFilename);
        await writeFile(coverFilePath, coverBuffer);
        updateData.coverPath = `/uploads/governance/${coverFilename}`;
    }

    await db.update(governanceDocs)
        .set(updateData)
        .where(eq(governanceDocs.id, id));

    revalidatePath('/admin/governance');
    revalidatePath('/');
}

export async function deleteGovernanceDoc(id: number) {
    await db.delete(governanceDocs).where(eq(governanceDocs.id, id));
    revalidatePath('/admin/governance');
}
