'use server';

import { UserService } from './service';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

export async function getUsers() {
    return UserService.getAll();
}

export async function getRoles() {
    return UserService.getRoles();
}

export async function createUser(data: {
    fullName: string;
    identifier: string;
    email: string;
    passwordHash: string;
    roleId: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}) {
    await UserService.create(data);
    revalidatePath('/admin/governance');
}

export async function updateUser(id: number, data: {
    fullName: string;
    identifier: string;
    email: string;
    roleId: number;
    passwordHash?: string;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}) {
    await UserService.update(id, data);
    revalidatePath('/admin/governance');
}

export async function deleteUser(id: number) {
    await UserService.delete(id);
    revalidatePath('/admin/governance');
}

export async function getPendingUsers() {
    return UserService.getPending();
}

export async function updateUserStatus(userId: number, status: 'Active' | 'Rejected') {
    await UserService.updateStatus(userId, status);
    revalidatePath('/admin/validations');
}

export async function updateUserProfile(data: {
    fullName?: string;
    identifier?: string;
    currentPassword: string;
    newEmail?: string;
    newPassword?: string;
    confirmNewPassword?: string;
}) {
    const session = await getSession();
    if (!session?.user) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;

    // Get current user and role
    const userRecord = await UserService.getById(userId);
    if (!userRecord) {
        throw new Error('User not found');
    }

    const { user, roleName } = userRecord;

    // Verify current password
    const passwordMatch = await UserService.verifyPassword(data.currentPassword, user.passwordHash);
    if (!passwordMatch) {
        throw new Error('Password saat ini salah');
    }

    const updateData: any = {};
    const isAdmin = roleName === 'Admin';

    // Handle Identity Update (Admin Only)
    if (isAdmin) {
        if (data.fullName && data.fullName !== user.fullName) {
            updateData.fullName = data.fullName;
        }

        if (data.identifier && data.identifier !== user.identifier) {
            const isUnique = await UserService.isIdentifierUnique(data.identifier, userId);
            if (!isUnique) {
                throw new Error('NIM/NIDN sudah digunakan user lain');
            }
            updateData.identifier = data.identifier;
        }
    }

    // Handle Email Update
    if (data.newEmail && data.newEmail !== user.email) {
        const isUnique = await UserService.isEmailUnique(data.newEmail, userId);
        if (!isUnique) {
            throw new Error('Email sudah digunakan user lain');
        }
        updateData.email = data.newEmail;
    }

    // Handle Password Update
    if (data.newPassword) {
        if (data.newPassword !== data.confirmNewPassword) {
            throw new Error('Konfirmasi password baru tidak sesuai');
        }
        updateData.passwordHash = await UserService.hashPassword(data.newPassword);
    }

    if (Object.keys(updateData).length > 0) {
        await UserService.update(userId, {
            fullName: updateData.fullName || user.fullName,
            identifier: updateData.identifier || user.identifier,
            email: updateData.email || user.email,
            roleId: user.roleId,
            passwordHash: updateData.passwordHash,
        });
        revalidatePath('/admin/profile');
        revalidatePath('/student/profile');
        revalidatePath('/lecturer/profile');
    }
}
