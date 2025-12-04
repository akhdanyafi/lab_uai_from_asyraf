'use server';

import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
    const allUsers = await db
        .select({
            id: users.id,
            fullName: users.fullName,
            identifier: users.identifier,
            email: users.email,
            roleId: users.roleId,
            roleName: roles.name,
            createdAt: users.createdAt,
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .orderBy(desc(users.createdAt));

    return allUsers;
}

export async function getRoles() {
    return await db.select().from(roles);
}

export async function createUser(data: {
    fullName: string;
    identifier: string;
    email: string;
    passwordHash: string; // In a real app, hash this before sending or here
    roleId: number;
}) {
    // Check if identifier or email exists
    const existing = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.identifier, data.identifier), eq(users.email, data.email))
    });

    if (existing) {
        throw new Error('NIM/NIDN atau Email sudah terdaftar');
    }

    await db.insert(users).values(data);
    revalidatePath('/admin/governance');
}

export async function updateUser(id: number, data: {
    fullName: string;
    identifier: string;
    email: string;
    roleId: number;
    passwordHash?: string;
}) {
    const updateData: any = { ...data };
    if (!updateData.passwordHash) {
        delete updateData.passwordHash;
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    revalidatePath('/admin/governance');
}

export async function deleteUser(id: number) {
    await db.delete(users).where(eq(users.id, id));
    revalidatePath('/admin/governance');
}

export async function getPendingUsers() {
    return await db.select({
        id: users.id,
        fullName: users.fullName,
        identifier: users.identifier,
        email: users.email,
        createdAt: users.createdAt,
        role: roles.name,
    })
        .from(users)
        .innerJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.status, 'Pending'));
}

export async function updateUserStatus(userId: number, status: 'Active' | 'Rejected') {
    await db.update(users)
        .set({ status })
        .where(eq(users.id, userId));

    revalidatePath('/admin/validations');
}
