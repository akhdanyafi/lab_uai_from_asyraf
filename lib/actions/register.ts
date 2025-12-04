'use server';

import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function register(formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const identifier = formData.get('identifier') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        throw new Error('Password tidak cocok');
    }

    // Check if user exists
    const existingUser = await db.select().from(users).where(
        or(eq(users.email, email), eq(users.identifier, identifier))
    ).limit(1);

    if (existingUser.length > 0) {
        throw new Error('User dengan email atau NIM tersebut sudah terdaftar');
    }

    // Get 'Mahasiswa' role
    const studentRole = await db.select().from(roles).where(eq(roles.name, 'Mahasiswa')).limit(1);

    if (studentRole.length === 0) {
        throw new Error('Role Mahasiswa tidak ditemukan. Hubungi administrator.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await db.insert(users).values({
        fullName,
        identifier,
        email,
        passwordHash: hashedPassword,
        roleId: studentRole[0].id,
        status: 'Pending',
    });

    redirect('/login?registered=true');
}
