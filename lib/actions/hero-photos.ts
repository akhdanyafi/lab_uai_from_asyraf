'use server';

import { db } from '@/db';
import { heroPhotos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { saveFile, deleteFile } from '@/lib/upload';

export async function getHeroPhotos() {
    return await db.select().from(heroPhotos).orderBy(desc(heroPhotos.createdAt));
}

export async function addHeroPhoto(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        throw new Error('Image file is required');
    }

    const imageUrl = await saveFile(file);

    await db.insert(heroPhotos).values({
        title,
        description,
        imageUrl,
        link: link || null,
    });

    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}

export async function updateHeroPhoto(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const file = formData.get('file') as File;

    const updateData: any = {
        title,
        description,
        link: link || null,
    };

    if (file && file.size > 0) {
        // Get old photo to delete
        const oldPhoto = await db.query.heroPhotos.findFirst({
            where: eq(heroPhotos.id, id)
        });

        if (oldPhoto?.imageUrl) {
            await deleteFile(oldPhoto.imageUrl);
        }

        const imageUrl = await saveFile(file);
        updateData.imageUrl = imageUrl;
    }

    await db.update(heroPhotos)
        .set(updateData)
        .where(eq(heroPhotos.id, id));

    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}

export async function deleteHeroPhoto(id: number) {
    const photo = await db.query.heroPhotos.findFirst({
        where: eq(heroPhotos.id, id)
    });

    if (photo?.imageUrl) {
        await deleteFile(photo.imageUrl);
    }

    await db.delete(heroPhotos).where(eq(heroPhotos.id, id));
    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}
