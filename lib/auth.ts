import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = 'secret'; // TODO: Move to .env
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Session expires in 24 hours
        .sign(key);
}

export async function decrypt(input: string): Promise<any> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ['HS256'],
    });
    return payload;
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;
    return await decrypt(session);
}

/**
 * Require a specific permission. Throws if user doesn't have it.
 */
export async function requirePermission(permission: string) {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized: Not logged in');
    }
    if (!hasPermission(session, permission)) {
        throw new Error(`Unauthorized: Permission '${permission}' required`);
    }
    return session;
}

/**
 * Require ANY of the specified permissions. Throws if user has none.
 */
export async function requireAnyPermission(permissions: string[]) {
    const session = await getSession();
    if (!session) {
        throw new Error('Unauthorized: Not logged in');
    }
    if (!hasAnyPermission(session, permissions)) {
        throw new Error(`Unauthorized: One of [${permissions.join(', ')}] permissions required`);
    }
    return session;
}

/**
 * Check if session has a specific permission (non-throwing).
 */
export function hasPermission(session: any, permission: string): boolean {
    return session?.user?.permissions?.includes(permission) ?? false;
}

/**
 * Check if session has ANY of the specified permissions.
 */
export function hasAnyPermission(session: any, permissions: string[]): boolean {
    return permissions.some(p => hasPermission(session, p));
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get('session')?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    const parsed = await decrypt(session);
    parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const res = NextResponse.next();
    res.cookies.set({
        name: 'session',
        value: await encrypt(parsed),
        httpOnly: true,
        expires: parsed.expires,
    });
    return res;
}
