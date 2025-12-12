'use server';

import bcrypt from 'bcryptjs';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, desc, ne, and, or } from 'drizzle-orm';
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
            batch: users.batch,
            studyType: users.studyType
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
    passwordHash: string;
    roleId: number;
    batch?: number;
    studyType?: 'Reguler' | 'Hybrid';
}) {
    // Check if identifier or email exists
    const existing = await db.query.users.findFirst({
        where: (users, { or, eq }) => or(eq(users.identifier, data.identifier), eq(users.email, data.email))
    });

    if (existing) {
        throw new Error('NIM/NIDN atau Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    const userData = { ...data, passwordHash: hashedPassword };

    await db.insert(users).values(userData);
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
    // Check for conflicts excluding current user
    const existing = await db.query.users.findFirst({
        where: (users, { or, eq, and, ne }) => and(
            ne(users.id, id),
            or(eq(users.identifier, data.identifier), eq(users.email, data.email))
        )
    });

    if (existing) {
        throw new Error('NIM/NIDN atau Email sudah digunakan user lain');
    }

    const updateData: any = { ...data };

    if (updateData.passwordHash) {
        updateData.passwordHash = await bcrypt.hash(updateData.passwordHash, 10);
    } else {
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
