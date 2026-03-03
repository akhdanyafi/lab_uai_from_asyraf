'use server';

import { PermissionService } from './service';
import { requirePermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getAllPermissions() {
    await requirePermission('users.manage');
    return PermissionService.getAllPermissions();
}

export async function getUserPermissionOverrides(userId: string) {
    await requirePermission('users.manage');
    return PermissionService.getUserOverrides(userId);
}

export async function getEffectivePermissions(userId: string, roleId: number) {
    await requirePermission('users.manage');
    return PermissionService.getEffectivePermissions(userId, roleId);
}

export async function setUserPermission(userId: string, permissionCode: string, granted: boolean) {
    await requirePermission('users.manage');
    await PermissionService.setUserPermission(userId, permissionCode, granted);
    revalidatePath('/admin/validations');
}

export async function removeUserPermission(userId: string, permissionCode: string) {
    await requirePermission('users.manage');
    await PermissionService.removeUserPermission(userId, permissionCode);
    revalidatePath('/admin/validations');
}

export async function updateUserPermissions(
    userId: string,
    permissionOverrides: { code: string; granted: boolean }[]
) {
    await requirePermission('users.manage');
    await PermissionService.setUserPermissions(userId, permissionOverrides);
    revalidatePath('/admin/validations');
}

export async function getRolePermissionMap() {
    await requirePermission('users.manage');
    return PermissionService.getRolePermissionMap();
}
