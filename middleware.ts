import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, getSession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const session = await getSession();

    // Protected routes pattern
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
    const isStudentRoute = request.nextUrl.pathname.startsWith('/student') ||
        request.nextUrl.pathname.startsWith('/peminjaman') ||
        request.nextUrl.pathname.startsWith('/akademik');
    const isLecturerRoute = request.nextUrl.pathname.startsWith('/lecturer');

    if (!session && (isAdminRoute || isStudentRoute || isLecturerRoute)) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (session) {
        // Role-based access control
        const role = session.user.role;

        if (isAdminRoute && role !== 'Admin') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (isStudentRoute && role !== 'Mahasiswa') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        if (isLecturerRoute && role !== 'Dosen') {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return await updateSession(request);
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/student/:path*',
        '/lecturer/:path*',
        '/peminjaman/:path*',
        '/akademik/:path*',
        '/dashboard/:path*',
        '/login',
    ],
};
