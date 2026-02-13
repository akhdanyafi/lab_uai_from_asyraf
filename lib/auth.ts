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

export async function requireAdmin() {
    const session = await getSession();
    if (!session || session.user.role !== 'Admin') {
        throw new Error('Unauthorized: Admin access required');
    }
    return session;
}

export async function requireKepalaLab() {
    const session = await getSession();
    if (!session || session.user.role !== 'Kepala Laboratorium') {
        throw new Error('Unauthorized: Kepala Laboratorium access required');
    }
    return session;
}

export async function requireKaprodi() {
    const session = await getSession();
    if (!session || session.user.role !== 'Kaprodi') {
        throw new Error('Unauthorized: Kaprodi access required');
    }
    return session;
}

/**
 * Requires Admin or Kepala Laboratorium role
 */
export async function requireLabStaff() {
    const session = await getSession();
    if (!session || !['Admin', 'Kepala Laboratorium'].includes(session.user.role)) {
        throw new Error('Unauthorized: Admin or Kepala Laboratorium access required');
    }
    return session;
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
