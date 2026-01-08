/**
 * Practicum Module Service
 * Business logic for practicum modules management
 */

import { db } from '@/db';
import { practicumModules } from '@/db/schema';
import { eq, desc, like, or } from 'drizzle-orm';
import type { CreateModuleInput, UpdateModuleInput } from './types';

export class PracticumService {
    /**
     * Get all modules
     */
    static async getAll() {
        return await db.select().from(practicumModules).orderBy(desc(practicumModules.createdAt));
    }

    /**
     * Get module by ID
     */
    static async getById(id: number) {
        const results = await db.select().from(practicumModules).where(eq(practicumModules.id, id)).limit(1);
        return results[0] || null;
    }

    /**
     * Search modules by name or subject
     */
    static async search(query: string) {
        const searchTerm = `%${query}%`;
        return await db
            .select()
            .from(practicumModules)
            .where(
                or(
                    like(practicumModules.name, searchTerm),
                    like(practicumModules.subjects, searchTerm)
                )
            )
            .orderBy(desc(practicumModules.createdAt));
    }

    /**
     * Create new module
     */
    static async create(data: CreateModuleInput) {
        await db.insert(practicumModules).values({
            name: data.name,
            description: data.description || null,
            filePath: data.filePath || null,
            subjects: data.subjects ? JSON.stringify(data.subjects) : null,
        });
    }

    /**
     * Update module
     */
    static async update(id: number, data: UpdateModuleInput) {
        const updateData: Record<string, any> = {
            updatedAt: new Date(),
        };

        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;
        if (data.filePath !== undefined) updateData.filePath = data.filePath;
        if (data.subjects !== undefined) updateData.subjects = JSON.stringify(data.subjects);

        await db.update(practicumModules).set(updateData).where(eq(practicumModules.id, id));
    }

    /**
     * Delete module
     */
    static async delete(id: number) {
        await db.delete(practicumModules).where(eq(practicumModules.id, id));
    }

    /**
     * Get all unique subjects from modules
     */
    static async getAllSubjects(): Promise<string[]> {
        const modules = await db.select({ subjects: practicumModules.subjects }).from(practicumModules);
        const subjectSet = new Set<string>();

        modules.forEach(m => {
            if (m.subjects) {
                try {
                    const parsed = JSON.parse(m.subjects);
                    if (Array.isArray(parsed)) {
                        parsed.forEach(s => subjectSet.add(s));
                    }
                } catch { }
            }
        });

        return Array.from(subjectSet).sort();
    }
}
