import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession, getSession } from '@/lib/auth';
import { checkRateLimit, getCategory } from '@/lib/rateLimiter';

export async function middleware(request: NextRequest) {
    // ─── Rate Limiting ──────────────────────────────────
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
        || request.headers.get('x-real-ip')
        || '127.0.0.1';

    // Determine rate limit category based on route
    const category = getCategory(request.nextUrl.pathname);

    // Server Actions are POST requests to page routes with Next-Action header
    const isServerAction = request.method === 'POST'
        && request.headers.get('next-action');
    const effectiveCategory = isServerAction ? 'actions' : category;

    const rateLimit = checkRateLimit(ip, effectiveCategory);

    if (!rateLimit.allowed) {
        return new NextResponse(
            JSON.stringify({
                error: 'Terlalu banyak request. Silakan coba lagi nanti.',
                retryAfter: rateLimit.resetIn,
            }),
            {
                status: 429,
                headers: {
                    'Content-Type': 'application/json',
                    'Retry-After': String(rateLimit.resetIn),
                    'X-RateLimit-Limit': String(rateLimit.limit),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(rateLimit.resetIn),
                },
            }
        );
    }

    // ─── Authentication ─────────────────────────────────
    const session = await getSession();

    // Protected routes pattern
    const isProtectedRoute =
        request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/student') ||
        request.nextUrl.pathname.startsWith('/lecturer') ||
        request.nextUrl.pathname.startsWith('/peminjaman') ||
        request.nextUrl.pathname.startsWith('/akademik') ||
        request.nextUrl.pathname.startsWith('/dashboard');

    // Redirect to login if not authenticated on protected routes
    if (!session && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // ─── Continue with session update ───────────────────
    const response = await updateSession(request);

    // Attach rate limit headers to every response
    if (response) {
        response.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
        response.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
        response.headers.set('X-RateLimit-Reset', String(rateLimit.resetIn));
        return response;
    }

    // Fallback: return NextResponse.next() with rate limit headers
    const fallback = NextResponse.next();
    fallback.headers.set('X-RateLimit-Limit', String(rateLimit.limit));
    fallback.headers.set('X-RateLimit-Remaining', String(rateLimit.remaining));
    fallback.headers.set('X-RateLimit-Reset', String(rateLimit.resetIn));
    return fallback;
}

export const config = {
    matcher: [
        // Protected routes
        '/admin/:path*',
        '/student/:path*',
        '/lecturer/:path*',
        '/peminjaman/:path*',
        '/akademik/:path*',
        '/dashboard/:path*',
        '/login',
        // API routes (for rate limiting)
        '/api/:path*',
    ],
};
