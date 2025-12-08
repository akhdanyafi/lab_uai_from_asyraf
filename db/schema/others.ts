import { mysqlTable, int, varchar, text, datetime, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';
import { users } from './users';

// Governance Docs
export const governanceDocs = mysqlTable('governance_docs', {
    id: int('id').autoincrement().primaryKey(),
    adminId: int('admin_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    filePath: varchar('file_path', { length: 255 }).notNull(),
    coverPath: varchar('cover_path', { length: 255 }),
    type: mysqlEnum('type', ['SOP', 'LPJ Bulanan']).notNull(),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    adminIdx: index('admin_idx').on(table.adminId),
}));

// Publications (Jurnal Publikasi)
export const publications = mysqlTable('publications', {
    id: int('id').autoincrement().primaryKey(),
    uploaderId: int('uploader_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    authorName: varchar('author_name', { length: 255 }).notNull(), // Manual input for author name
    title: varchar('title', { length: 255 }).notNull(),
    abstract: text('abstract'),
    filePath: varchar('file_path', { length: 255 }), // Optional if link is provided
    link: varchar('link', { length: 255 }),
    viewCount: int('view_count').default(0).notNull(),
    publishDate: datetime('publish_date'),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    uploaderIdx: index('uploader_idx').on(table.uploaderId),
}));

export const publicationsRelations = relations(publications, ({ one }) => ({
    uploader: one(users, {
        fields: [publications.uploaderId],
        references: [users.id],
    }),
}));

// Activity Photos (Foto Kegiatan Homepage)
export const heroPhotos = mysqlTable('hero_photos', {
    id: int('id').autoincrement().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    imageUrl: text('image_url').notNull(),
    link: text('link'), // Optional link
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
});
