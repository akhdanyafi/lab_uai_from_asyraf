/**
 * Hero Photo Service
 * Business logic for hero photos/carousel management
 */

import { db } from '@/db';
import { heroPhotos } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface CreateHeroPhotoInput {
    title: string;
    description?: string;
    imageUrl: string;
    link?: string | null;
}

export interface UpdateHeroPhotoInput {
    title: string;
    description?: string;
    imageUrl?: string;
    link?: string | null;
}

export class HeroPhotoService {
    /**
     * Get all hero photos
     */
    static async getAll() {
        return await db.select().from(heroPhotos).orderBy(desc(heroPhotos.createdAt));
    }

    /**
     * Get a hero photo by ID
     */
    static async getById(id: number) {
        return await db.query.heroPhotos.findFirst({
            where: eq(heroPhotos.id, id)
        });
    }

    /**
     * Create a new hero photo
     */
    static async create(data: CreateHeroPhotoInput) {
        await db.insert(heroPhotos).values({
            title: data.title,
            description: data.description,
            imageUrl: data.imageUrl,
            link: data.link || null,
        });
    }

    /**
     * Update a hero photo
     */
    static async update(id: number, data: UpdateHeroPhotoInput) {
        const updateData: any = {
            title: data.title,
            description: data.description,
            link: data.link || null,
        };

        if (data.imageUrl) {
            updateData.imageUrl = data.imageUrl;
        }

        await db.update(heroPhotos)
            .set(updateData)
            .where(eq(heroPhotos.id, id));
    }

    /**
     * Delete a hero photo
     */
    static async delete(id: number) {
        await db.delete(heroPhotos).where(eq(heroPhotos.id, id));
    }
}
