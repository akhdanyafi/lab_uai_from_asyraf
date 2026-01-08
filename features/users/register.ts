'use server';

import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq, or, and } from 'drizzle-orm';
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
        // Check if email is already used by another user
        const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (existingEmail.length > 0) {
            return { success: false, error: 'Email sudah terdaftar' };
        }

        // Check if there's a pre-registered user with matching fullName and identifier
        const preRegisteredUser = await db.select().from(users).where(
            and(
                eq(users.identifier, identifier),
                eq(users.status, 'Pre-registered')
            )
        ).limit(1);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (preRegisteredUser.length > 0) {
            // Verify fullName matches (case-insensitive)
            const matchName = preRegisteredUser[0].fullName.toLowerCase().trim() === fullName.toLowerCase().trim();

            if (matchName) {
                // Update pre-registered user to activate their account
                await db.update(users)
                    .set({
                        email,
                        passwordHash: hashedPassword,
                        status: 'Active', // Auto-activate!
                        batch: batch || preRegisteredUser[0].batch,
                        studyType: studyType || preRegisteredUser[0].studyType,
                        programStudi: programStudi || preRegisteredUser[0].programStudi,
                        dosenPembimbing: dosenPembimbing || preRegisteredUser[0].dosenPembimbing,
                    })
                    .where(eq(users.id, preRegisteredUser[0].id));

                return { success: true };
            } else {
                return { success: false, error: 'Nama tidak cocok dengan data yang terdaftar. Hubungi admin jika ada kesalahan data.' };
            }
        }

        // Check if identifier is already used by an active/pending user
        const existingIdentifier = await db.select().from(users).where(eq(users.identifier, identifier)).limit(1);
        if (existingIdentifier.length > 0) {
            return { success: false, error: 'NIM/NIDN sudah terdaftar' };
        }

        // Get 'Mahasiswa' role
        const studentRole = await db.select().from(roles).where(eq(roles.name, 'Mahasiswa')).limit(1);

        if (studentRole.length === 0) {
            return { success: false, error: 'Role Mahasiswa tidak ditemukan. Hubungi administrator.' };
        }

        // Create new user (not pre-registered, so requires approval)
        await db.insert(users).values({
            fullName,
            identifier,
            email,
            passwordHash: hashedPassword,
            roleId: studentRole[0].id,
            status: 'Pending', // Requires admin approval
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

