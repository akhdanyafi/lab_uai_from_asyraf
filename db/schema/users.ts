import { mysqlTable, int, varchar, datetime, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { relations, sql } from 'drizzle-orm';

// Roles
export const roles = mysqlTable('roles', {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(), // 'Admin', 'Mahasiswa', 'Dosen'
});

// Users
export const users = mysqlTable('users', {
    id: int('id').autoincrement().primaryKey(),
    roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'restrict' }),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    identifier: varchar('identifier', { length: 50 }).notNull().unique(), // NIM or NIDN
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    status: mysqlEnum('status', ['Active', 'Pending', 'Rejected']).default('Pending'),
    createdAt: datetime('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
    roleIdx: index('role_idx').on(table.roleId),
}));

export const usersRelations = relations(users, ({ one }) => ({
    role: one(roles, {
        fields: [users.roleId],
        references: [roles.id],
    }),
}));
