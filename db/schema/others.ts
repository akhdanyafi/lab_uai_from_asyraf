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
    uploaderId: int('uploader_id').references(() => users.id, { onDelete: 'set null' }), // Admin/Dosen who published (nullable for pending)
    submitterId: int('submitter_id').references(() => users.id, { onDelete: 'cascade' }), // User who submitted the draft
    authorName: varchar('author_name', { length: 255 }).notNull(), // Manual input for author name
    title: varchar('title', { length: 255 }).notNull(),
    abstract: text('abstract'),
    keywords: text('keywords'), // JSON array of keywords: ["AI", "Machine Learning"]
    filePath: varchar('file_path', { length: 255 }), // Optional if link is provided
    link: varchar('link', { length: 255 }),
    viewCount: int('view_count').default(0).notNull(),
    status: mysqlEnum('status', ['Pending', 'Published', 'Rejected']).default('Pending').notNull(),
    publishDate: datetime('publish_date'),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    uploaderIdx: index('uploader_idx').on(table.uploaderId),
    submitterIdx: index('submitter_idx').on(table.submitterId),
    statusIdx: index('status_idx').on(table.status),
}));

export const publicationsRelations = relations(publications, ({ one, many }) => ({
    uploader: one(users, {
        fields: [publications.uploaderId],
        references: [users.id],
        relationName: 'uploader',
    }),
    submitter: one(users, {
        fields: [publications.submitterId],
        references: [users.id],
        relationName: 'submitter',
    }),
    likes: many(publicationLikes),
}));

// Publication Likes (Many-to-Many: User <-> Publication)
export const publicationLikes = mysqlTable('publication_likes', {
    id: int('id').autoincrement().primaryKey(),
    publicationId: int('publication_id').notNull().references(() => publications.id, { onDelete: 'cascade' }),
    userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    publicationIdx: index('publication_idx').on(table.publicationId),
    userIdx: index('user_idx').on(table.userId),
    // Unique constraint: one like per user per publication
    uniqueLike: index('unique_like').on(table.publicationId, table.userId),
}));

export const publicationLikesRelations = relations(publicationLikes, ({ one }) => ({
    publication: one(publications, {
        fields: [publicationLikes.publicationId],
        references: [publications.id],
    }),
    user: one(users, {
        fields: [publicationLikes.userId],
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
