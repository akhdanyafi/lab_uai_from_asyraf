import { mysqlTable, int, varchar, text, boolean, index, uniqueIndex } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { users, roles } from './users';

// Master Permissions List
export const permissions = mysqlTable('permissions', {
    id: int('id').autoincrement().primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),      // e.g. 'inventory.manage'
    name: varchar('name', { length: 100 }).notNull(),               // e.g. 'Kelola Inventaris'
    category: varchar('category', { length: 50 }).notNull(),        // e.g. 'Inventory'
    description: text('description'),
});

// Default Permissions per Role
export const rolePermissions = mysqlTable('role_permissions', {
    id: int('id').autoincrement().primaryKey(),
    roleId: int('role_id').notNull().references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: int('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
}, (table) => ({
    uniqueRolePerm: uniqueIndex('unique_role_perm').on(table.roleId, table.permissionId),
    roleIdx: index('rp_role_idx').on(table.roleId),
}));

// User-level Permission Overrides
export const userPermissions = mysqlTable('user_permissions', {
    id: int('id').autoincrement().primaryKey(),
    userId: varchar('user_id', { length: 50 }).notNull().references(() => users.identifier, { onDelete: 'cascade' }),
    permissionId: int('permission_id').notNull().references(() => permissions.id, { onDelete: 'cascade' }),
    granted: boolean('granted').notNull().default(true), // true=grant, false=revoke
}, (table) => ({
    uniqueUserPerm: uniqueIndex('unique_user_perm').on(table.userId, table.permissionId),
    userIdx: index('up_user_idx').on(table.userId),
}));

// Relations
export const permissionsRelations = relations(permissions, ({ many }) => ({
    rolePermissions: many(rolePermissions),
    userPermissions: many(userPermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
    role: one(roles, {
        fields: [rolePermissions.roleId],
        references: [roles.id],
    }),
    permission: one(permissions, {
        fields: [rolePermissions.permissionId],
        references: [permissions.id],
    }),
}));

export const userPermissionsRelations = relations(userPermissions, ({ one }) => ({
    user: one(users, {
        fields: [userPermissions.userId],
        references: [users.identifier],
    }),
    permission: one(permissions, {
        fields: [userPermissions.permissionId],
        references: [permissions.id],
    }),
}));
