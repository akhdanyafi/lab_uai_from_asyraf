/**
 * Publication Service
 * Business logic for publications management (admin/dosen only)
 */

import { db } from '@/db';
import { publications, users, publicationLikes } from '@/db/schema';
import { eq, desc, sql, like, or, and, count } from 'drizzle-orm';

export interface CreatePublicationInput {
    uploaderId?: number;
    authorName: string;
    title: string;
    abstract?: string;
    keywords?: string; // JSON string array
    link?: string;
    filePath?: string;
    publishYear?: number;
    publishMonth?: number;
    publishDay?: number;
}

export interface PublicationFilters {
    search?: string;
    keyword?: string;
    year?: number;
    month?: number;
    page?: number;
    perPage?: number; // 10 | 20 | 50 | 100
}

export interface PaginatedResult<T> {
    data: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
}

export class PublicationService {
    /**
     * Create a new publication (Admin/Dosen direct publish)
     */
    static async create(data: CreatePublicationInput) {
        await db.insert(publications).values({
            uploaderId: data.uploaderId,
            authorName: data.authorName,
            title: data.title,
            abstract: data.abstract,
            keywords: data.keywords,
            link: data.link,
            filePath: data.filePath,
            publishYear: data.publishYear,
            publishMonth: data.publishMonth,
            publishDay: data.publishDay,
        });
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
        publishYear?: number;
        publishMonth?: number | null;
        publishDay?: number | null;
    }) {
        await db.update(publications)
            .set(data)
            .where(eq(publications.id, id));
    }

    /**
     * Get all publications (admin/dosen view) with pagination
     */
    static async getAll(filters?: PublicationFilters): Promise<PaginatedResult<any>> {
        const page = filters?.page || 1;
        const perPage = filters?.perPage || 20;
        const offset = (page - 1) * perPage;

        // Build conditions
        const conditions: any[] = [];

        if (filters?.search) {
            conditions.push(
                or(
                    like(publications.title, `%${filters.search}%`),
                    like(publications.authorName, `%${filters.search}%`)
                )
            );
        }

        if (filters?.keyword) {
            conditions.push(like(publications.keywords, `%${filters.keyword}%`));
        }

        if (filters?.year) {
            conditions.push(eq(publications.publishYear, filters.year));
        }

        if (filters?.month) {
            conditions.push(eq(publications.publishMonth, filters.month));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const countResult = await db.select({ count: count() })
            .from(publications)
            .where(whereClause);
        const totalCount = countResult[0]?.count || 0;

        // Get data
        const results = await db.select({
            publication: publications,
            uploaderName: users.fullName,
        })
            .from(publications)
            .leftJoin(users, eq(publications.uploaderId, users.id))
            .where(whereClause)
            .orderBy(desc(publications.createdAt))
            .limit(perPage)
            .offset(offset);

        return {
            data: results.map(r => ({
                ...r.publication,
                uploaderName: r.uploaderName,
            })),
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: page,
        };
    }

    /**
     * Get published publications for public view with search/filter/pagination
     */
    static async getPublished(filters?: PublicationFilters): Promise<PaginatedResult<any>> {
        const page = filters?.page || 1;
        const perPage = filters?.perPage || 20;
        const offset = (page - 1) * perPage;

        const conditions: any[] = [];

        if (filters?.search) {
            conditions.push(
                or(
                    like(publications.title, `%${filters.search}%`),
                    like(publications.authorName, `%${filters.search}%`)
                )
            );
        }

        if (filters?.keyword) {
            conditions.push(like(publications.keywords, `%${filters.keyword}%`));
        }

        if (filters?.year) {
            conditions.push(eq(publications.publishYear, filters.year));
        }

        if (filters?.month) {
            conditions.push(eq(publications.publishMonth, filters.month));
        }

        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Get total count
        const countResult = await db.select({ count: count() })
            .from(publications)
            .where(whereClause);
        const totalCount = countResult[0]?.count || 0;

        // Get data
        const data = await db.select()
            .from(publications)
            .where(whereClause)
            .orderBy(desc(publications.publishYear), desc(publications.publishMonth), desc(publications.publishDay))
            .limit(perPage)
            .offset(offset);

        return {
            data,
            totalCount,
            totalPages: Math.ceil(totalCount / perPage),
            currentPage: page,
        };
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
     * Get top publications by view count
     */
    static async getTop(limit: number = 5) {
        return await db.select()
            .from(publications)
            .orderBy(desc(publications.viewCount))
            .limit(limit);
    }

    /**
     * Get all unique keywords from publications
     */
    static async getAllKeywords(): Promise<string[]> {
        const results = await db.select({ keywords: publications.keywords })
            .from(publications);

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
     * Get all unique publish years
     */
    static async getAllYears(): Promise<number[]> {
        const results = await db.selectDistinct({ year: publications.publishYear })
            .from(publications)
            .where(sql`${publications.publishYear} IS NOT NULL`)
            .orderBy(desc(publications.publishYear));

        return results.map(r => r.year!).filter(Boolean);
    }

    /**
     * Toggle like for a publication
     */
    static async toggleLike(publicationId: number, userId: number) {
        const existingLike = await db.select()
            .from(publicationLikes)
            .where(and(
                eq(publicationLikes.publicationId, publicationId),
                eq(publicationLikes.userId, userId)
            ))
            .limit(1);

        if (existingLike.length > 0) {
            await db.delete(publicationLikes).where(eq(publicationLikes.id, existingLike[0].id));
            const likeCount = await this.getLikeCount(publicationId);
            return { liked: false, likeCount };
        } else {
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
