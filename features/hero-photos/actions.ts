'use server';

import { HeroPhotoService } from './service';
import { revalidatePath } from 'next/cache';
import { saveFile, deleteFile } from '@/lib/upload';
import { requirePermission } from '@/lib/auth';

export async function getHeroPhotos() {
    return HeroPhotoService.getAll();
}

export async function addHeroPhoto(formData: FormData) {
    await requirePermission('hero.manage');
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const file = formData.get('file') as File;

    if (!file || file.size === 0) {
        throw new Error('Image file is required');
    }

    const imageUrl = await saveFile(file);

    await HeroPhotoService.create({
        title,
        description,
        imageUrl,
        link: link || null,
    });

    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}

export async function updateHeroPhoto(id: number, formData: FormData) {
    await requirePermission('hero.manage');
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const link = formData.get('link') as string;
    const file = formData.get('file') as File;

    let imageUrl: string | undefined;

    if (file && file.size > 0) {
        // Get old photo to delete
        const oldPhoto = await HeroPhotoService.getById(id);

        if (oldPhoto?.imageUrl) {
            await deleteFile(oldPhoto.imageUrl);
        }

        imageUrl = await saveFile(file);
    }

    await HeroPhotoService.update(id, {
        title,
        description,
        imageUrl,
        link: link || null,
    });

    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}

export async function deleteHeroPhoto(id: number) {
    await requirePermission('hero.manage');
    const photo = await HeroPhotoService.getById(id);

    if (photo?.imageUrl) {
        await deleteFile(photo.imageUrl);
    }

    await HeroPhotoService.delete(id);
    revalidatePath('/');
    revalidatePath('/admin/hero-photos');
}
