import { db } from '@/db';
import { permissions, rolePermissions, userPermissions, users, roles } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export class PermissionService {
    /**
     * Get all available permissions, grouped by category
     */
    static async getAllPermissions() {
        return await db.select().from(permissions).orderBy(permissions.category, permissions.code);
    }

    /**
     * Get role default permission codes
     */
    static async getRolePermissions(roleId: number): Promise<string[]> {
        const result = await db.select({ code: permissions.code })
            .from(rolePermissions)
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
            .where(eq(rolePermissions.roleId, roleId));
        return result.map(r => r.code);
    }

    /**
     * Get all role permissions as a map: roleId -> permission codes
     */
    static async getRolePermissionMap(): Promise<Record<number, string[]>> {
        const allRolePerms = await db.select({
            roleId: rolePermissions.roleId,
            code: permissions.code,
        })
            .from(rolePermissions)
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id));

        const map: Record<number, string[]> = {};
        for (const rp of allRolePerms) {
            if (!map[rp.roleId]) map[rp.roleId] = [];
            map[rp.roleId].push(rp.code);
        }
        return map;
    }

    /**
     * Get user-level permission overrides
     */
    static async getUserOverrides(userId: number) {
        return await db.select({
            id: userPermissions.id,
            permissionId: userPermissions.permissionId,
            code: permissions.code,
            name: permissions.name,
            category: permissions.category,
            granted: userPermissions.granted,
        })
            .from(userPermissions)
            .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
            .where(eq(userPermissions.userId, userId));
    }

    /**
     * Get effective permissions for a user (role defaults + user overrides)
     */
    static async getEffectivePermissions(userId: number, roleId: number): Promise<string[]> {
        const rolePerms = await db.select({ code: permissions.code })
            .from(rolePermissions)
            .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
            .where(eq(rolePermissions.roleId, roleId));

        const defaultCodes = new Set(rolePerms.map(rp => rp.code));

        const userOverrides = await db.select({
            code: permissions.code,
            granted: userPermissions.granted,
        })
            .from(userPermissions)
            .innerJoin(permissions, eq(userPermissions.permissionId, permissions.id))
            .where(eq(userPermissions.userId, userId));

        for (const override of userOverrides) {
            if (override.granted) {
                defaultCodes.add(override.code);
            } else {
                defaultCodes.delete(override.code);
            }
        }

        return Array.from(defaultCodes);
    }

    /**
     * Set a user-level permission override (grant or revoke)
     */
    static async setUserPermission(userId: number, permissionCode: string, granted: boolean) {
        const perm = await db.select().from(permissions).where(eq(permissions.code, permissionCode)).limit(1);
        if (perm.length === 0) throw new Error(`Permission '${permissionCode}' not found`);

        // Upsert: insert or update on duplicate
        const existing = await db.select().from(userPermissions)
            .where(and(
                eq(userPermissions.userId, userId),
                eq(userPermissions.permissionId, perm[0].id)
            )).limit(1);

        if (existing.length > 0) {
            await db.update(userPermissions)
                .set({ granted })
                .where(eq(userPermissions.id, existing[0].id));
        } else {
            await db.insert(userPermissions).values({
                userId,
                permissionId: perm[0].id,
                granted,
            });
        }
    }

    /**
     * Remove a user-level permission override (revert to role default)
     */
    static async removeUserPermission(userId: number, permissionCode: string) {
        const perm = await db.select().from(permissions).where(eq(permissions.code, permissionCode)).limit(1);
        if (perm.length === 0) return;

        await db.delete(userPermissions)
            .where(and(
                eq(userPermissions.userId, userId),
                eq(userPermissions.permissionId, perm[0].id)
            ));
    }

    /**
     * Bulk set user permissions — replaces all user overrides
     */
    static async setUserPermissions(userId: number, permissionOverrides: { code: string; granted: boolean }[]) {
        // Clear existing overrides for this user
        await db.delete(userPermissions).where(eq(userPermissions.userId, userId));

        if (permissionOverrides.length === 0) return;

        // Get permission ids
        const allPerms = await db.select().from(permissions);
        const permMap = new Map(allPerms.map(p => [p.code, p.id]));

        const values = permissionOverrides
            .filter(o => permMap.has(o.code))
            .map(o => ({
                userId,
                permissionId: permMap.get(o.code)!,
                granted: o.granted,
            }));

        if (values.length > 0) {
            await db.insert(userPermissions).values(values);
        }
    }
}
