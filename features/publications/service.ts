/**
 * Publication Service
 * Business logic for publications management
 */

import { db } from '@/db';
import { publications } from '@/db/schema';
import { eq, desc, sql } from 'drizzle-orm';

export interface CreatePublicationInput {
    uploaderId: number;
    authorName: string;
    title: string;
    abstract?: string;
    link?: string;
    filePath?: string;
    publishDate?: Date;
}

export class PublicationService {
    /**
     * Create a new publication
     */
    static async create(data: CreatePublicationInput) {
        await db.insert(publications).values(data);
    }

    /**
     * Get all publications
     */
    static async getAll() {
        return await db.select().from(publications).orderBy(desc(publications.publishDate));
    }

    /**
     * Delete a publication
     */
    static async delete(id: number) {
        await db.delete(publications).where(eq(publications.id, id));
    }

    /**
     * Increment view count
     */
    static async incrementViewCount(id: number) {
        await db.update(publications)
            .set({ viewCount: sql`${publications.viewCount} + 1` })
            .where(eq(publications.id, id));
    }

    /**
     * Get top publications by view count
     */
    static async getTop(limit: number = 5) {
        return await db.select()
            .from(publications)
            .orderBy(desc(publications.viewCount))
            .limit(limit);
    }
}
