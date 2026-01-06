'use server';

import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, or } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function register(formData: FormData): Promise<{ success: true } | { success: false; error: string }> {
    const fullName = formData.get('fullName') as string;
    const identifier = formData.get('identifier') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { success: false, error: 'Password tidak cocok' };
    }

    const batch = formData.get('batch') ? parseInt(formData.get('batch') as string) : null;
    const studyType = formData.get('studyType') as 'Reguler' | 'Hybrid' | null;
    const programStudi = (formData.get('programStudi') as string) || 'Informatika';
    const dosenPembimbing = formData.get('dosenPembimbing') as string;

    if (!batch || !studyType) {
        return { success: false, error: 'Mohon lengkapi data angkatan dan tipe belajar' };
    }

    if (!dosenPembimbing) {
        return { success: false, error: 'Mohon pilih dosen pembimbing' };
    }

    try {
        // Check if user exists
        const existingUser = await db.select().from(users).where(
            or(eq(users.email, email), eq(users.identifier, identifier))
        ).limit(1);

        if (existingUser.length > 0) {
            return { success: false, error: 'User dengan email atau NIM tersebut sudah terdaftar' };
        }

        // Get 'Mahasiswa' role
        const studentRole = await db.select().from(roles).where(eq(roles.name, 'Mahasiswa')).limit(1);

        if (studentRole.length === 0) {
            return { success: false, error: 'Role Mahasiswa tidak ditemukan. Hubungi administrator.' };
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
            batch,
            studyType,
            programStudi,
            dosenPembimbing
        });

        return { success: true };
    } catch (error) {
        console.error('Registration error:', error);
        return { success: false, error: 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.' };
    }
}
