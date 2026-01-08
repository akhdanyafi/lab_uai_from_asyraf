import { mysqlTable, int, varchar, text, datetime } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

/**
 * Practicum Modules - Simple module management
 * 
 * Fields:
 * - name: Module name (e.g., "Modul 1 - Dasar Kriptografi")
 * - description: Optional description
 * - filePath: Uploaded file path
 * - subjects: JSON array of subjects (e.g., ["Kriptografi", "Komputasi Awan"])
 */
export const practicumModules = mysqlTable('practicum_modules', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    filePath: varchar('file_path', { length: 255 }),
    subjects: text('subjects'), // JSON array: ["Kriptografi", "Komputasi Awan"]
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime('updated_at'),
});
