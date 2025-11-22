'use server';

import { cookies } from 'next/headers';
import { db } from '@/db';
import { users, roles } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { encrypt } from '@/lib/auth';

export async function login(formData: any) {
    const { email, password } = formData;

    // Find user
    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (user.length === 0) {
        throw new Error('User not found');
    }

    const foundUser = user[0];

    // Verify password (TODO: Use bcrypt or argon2 in production)
    if (foundUser.passwordHash !== password) {
        throw new Error('Invalid password');
    }

    // Get role name
    const role = await db.select().from(roles).where(eq(roles.id, foundUser.roleId)).limit(1);
    const roleName = role[0]?.name;

    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: { ...foundUser, role: roleName }, expires });

    // Save the session in a cookie
    (await cookies()).set('session', session, { expires, httpOnly: true });
}

export async function logout() {
    // Destroy the session
    (await cookies()).set('session', '', { expires: new Date(0) });
}
