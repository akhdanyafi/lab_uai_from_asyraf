/**
 * Publication Service
 * Business logic for publications management with submission workflow
 */

import { db } from '@/db';
import { publications, users, publicationLikes } from '@/db/schema';
import { eq, desc, sql, like, or, and, count } from 'drizzle-orm';

export interface CreatePublicationInput {
    uploaderId?: number; // Admin who publishes
    submitterId?: number; // User who submits
    authorName: string;
    title: string;
    abstract?: string;
    keywords?: string; // JSON string array
    link?: string;
    filePath?: string;
    publishDate?: Date;
    status?: 'Pending' | 'Published' | 'Rejected';
}

export interface PublicationFilters {
    search?: string;
    keyword?: string;
    status?: 'Pending' | 'Published' | 'Rejected';
}

export class PublicationService {
    /**
     * Create a new publication (Admin direct publish)
     */
    static async create(data: CreatePublicationInput) {
        await db.insert(publications).values({
            ...data,
            status: data.status || 'Published',
            publishDate: data.publishDate || new Date(),
        });
    }

    /**
     * Submit publication draft (User submission - status: Pending)
     */
    static async submit(data: {
        submitterId: number;
        authorName: string;
        title: string;
        abstract?: string;
        keywords?: string;
        link?: string;
        filePath?: string;
    }) {
        await db.insert(publications).values({
            ...data,
            status: 'Pending',
        });
    }

    /**
     * Approve and publish a pending submission
     */
    static async approve(id: number, uploaderId: number, updates?: Partial<CreatePublicationInput>) {
        await db.update(publications)
            .set({
                status: 'Published',
                uploaderId,
                publishDate: new Date(),
                ...updates,
            })
            .where(eq(publications.id, id));
    }

    /**
     * Reject a pending submission
     */
    static async reject(id: number) {
        await db.update(publications)
            .set({ status: 'Rejected' })
            .where(eq(publications.id, id));
    }

    /**
     * Update a publication
     */
    static async update(id: number, data: {
        title?: string;
        authorName?: string;
        abstract?: string;
        keywords?: string;
        link?: string;
        filePath?: string;
        publishDate?: Date;
    }) {
        await db.update(publications)
            .set(data)
            .where(eq(publications.id, id));
    }

    /**
     * Get all publications (admin view)
     */
    static async getAll(filters?: PublicationFilters) {
        let query = db.select({
            publication: publications,
            uploaderName: users.fullName,
        })
            .from(publications)
            .leftJoin(users, eq(publications.uploaderId, users.id))
            .orderBy(desc(publications.createdAt));

        if (filters?.status) {
            query = query.where(eq(publications.status, filters.status)) as any;
        }

        const results = await query;
        return results.map(r => ({
            ...r.publication,
            uploaderName: r.uploaderName,
        }));
    }

    /**
     * Get published publications for public view with search/filter
     */
    static async getPublished(filters?: PublicationFilters) {
        const conditions = [eq(publications.status, 'Published')];

        if (filters?.search) {
            conditions.push(
                or(
                    like(publications.title, `%${filters.search}%`),
                    like(publications.authorName, `%${filters.search}%`)
                ) as any
            );
        }

        if (filters?.keyword) {
            conditions.push(like(publications.keywords, `%${filters.keyword}%`));
        }

        return await db.select()
            .from(publications)
            .where(and(...conditions))
            .orderBy(desc(publications.publishDate));
    }

    /**
     * Get publications by submitter (user's submissions)
     */
    static async getBySubmitter(submitterId: number) {
        return await db.select()
            .from(publications)
            .where(eq(publications.submitterId, submitterId))
            .orderBy(desc(publications.createdAt));
    }

    /**
     * Get pending submissions for review
     */
    static async getPending() {
        return await db.select({
            publication: publications,
            submitterName: users.fullName,
            submitterIdentifier: users.identifier,
        })
            .from(publications)
            .leftJoin(users, eq(publications.submitterId, users.id))
            .where(eq(publications.status, 'Pending'))
            .orderBy(desc(publications.createdAt));
    }

    /**
     * Get single publication by ID
     */
    static async getById(id: number) {
        const result = await db.select()
            .from(publications)
            .where(eq(publications.id, id))
            .limit(1);
        return result[0] || null;
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
     * Get top publications by view count (only published)
     */
    static async getTop(limit: number = 5) {
        return await db.select()
            .from(publications)
            .where(eq(publications.status, 'Published'))
            .orderBy(desc(publications.viewCount))
            .limit(limit);
    }

    /**
     * Get all unique keywords from published publications
     */
    static async getAllKeywords(): Promise<string[]> {
        const results = await db.select({ keywords: publications.keywords })
            .from(publications)
            .where(eq(publications.status, 'Published'));

        const keywordSet = new Set<string>();
        for (const row of results) {
            if (row.keywords) {
                try {
                    const parsed = JSON.parse(row.keywords);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(k => keywordSet.add(k));
                    }
                } catch { }
            }
        }
        return Array.from(keywordSet).sort();
    }

    /**
     * Toggle like for a publication
     * Returns: { liked: boolean, likeCount: number }
     */
    static async toggleLike(publicationId: number, userId: number) {
        // Check if already liked
        const existingLike = await db.select()
            .from(publicationLikes)
            .where(and(
                eq(publicationLikes.publicationId, publicationId),
                eq(publicationLikes.userId, userId)
            ))
            .limit(1);

        if (existingLike.length > 0) {
            // Unlike
            await db.delete(publicationLikes).where(eq(publicationLikes.id, existingLike[0].id));
            const likeCount = await this.getLikeCount(publicationId);
            return { liked: false, likeCount };
        } else {
            // Like
            await db.insert(publicationLikes).values({
                publicationId,
                userId,
            });
            const likeCount = await this.getLikeCount(publicationId);
            return { liked: true, likeCount };
        }
    }

    /**
     * Get like count for a publication
     */
    static async getLikeCount(publicationId: number): Promise<number> {
        const result = await db.select({ count: count() })
            .from(publicationLikes)
            .where(eq(publicationLikes.publicationId, publicationId));
        return result[0]?.count || 0;
    }

    /**
     * Check if user has liked a publication
     */
    static async checkUserLiked(publicationId: number, userId: number): Promise<boolean> {
        const result = await db.select()
            .from(publicationLikes)
            .where(and(
                eq(publicationLikes.publicationId, publicationId),
                eq(publicationLikes.userId, userId)
            ))
            .limit(1);
        return result.length > 0;
    }

    /**
     * Get like counts for multiple publications
     */
    static async getLikeCounts(publicationIds: number[]): Promise<Record<number, number>> {
        if (publicationIds.length === 0) return {};

        const results = await db.select({
            publicationId: publicationLikes.publicationId,
            count: count(),
        })
            .from(publicationLikes)
            .where(sql`${publicationLikes.publicationId} IN (${sql.join(publicationIds.map(id => sql`${id}`), sql`, `)})`)
            .groupBy(publicationLikes.publicationId);

        const counts: Record<number, number> = {};
        for (const row of results) {
            counts[row.publicationId] = row.count;
        }
        return counts;
    }

    /**
     * Get user's liked publication IDs
     */
    static async getUserLikedIds(userId: number, publicationIds: number[]): Promise<number[]> {
        if (publicationIds.length === 0) return [];

        const results = await db.select({ publicationId: publicationLikes.publicationId })
            .from(publicationLikes)
            .where(and(
                eq(publicationLikes.userId, userId),
                sql`${publicationLikes.publicationId} IN (${sql.join(publicationIds.map(id => sql`${id}`), sql`, `)})`
            ));

        return results.map(r => r.publicationId);
    }
}

