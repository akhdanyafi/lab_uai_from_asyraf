/**
 * In-memory Rate Limiter for Next.js Middleware (Edge-compatible)
 * 
 * Uses a sliding window approach with automatic cleanup.
 * Tracks request counts per IP with configurable limits per route category.
 */

interface RateLimitEntry {
    count: number;
    resetTime: number; // timestamp in ms
}

interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    maxRequests: number;
    /** Time window in seconds */
    windowSeconds: number;
}

// ─── Storage ────────────────────────────────────────────────

/** In-memory store keyed by `ip:category` */
const store = new Map<string, RateLimitEntry>();

/** Cleanup interval — remove expired entries every 60 seconds */
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60_000; // 60 seconds

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store) {
        if (now > entry.resetTime) {
            store.delete(key);
        }
    }
}

// ─── Rate Limit Configurations ──────────────────────────────

/** Default rate limit configs per route category */
export const RATE_LIMITS = {
    /** General page requests */
    general: { maxRequests: 120, windowSeconds: 60 } as RateLimitConfig,

    /** API routes (excluding upload) */
    api: { maxRequests: 60, windowSeconds: 60 } as RateLimitConfig,

    /** Authentication endpoints (login, register) */
    auth: { maxRequests: 10, windowSeconds: 300 } as RateLimitConfig, // 10 per 5 min

    /** File upload endpoints (heavy — OCR processing) */
    upload: { maxRequests: 5, windowSeconds: 60 } as RateLimitConfig, // 5 per minute

    /** Server actions (form submissions) */
    actions: { maxRequests: 30, windowSeconds: 60 } as RateLimitConfig,
} as const;

export type RateLimitCategory = keyof typeof RATE_LIMITS;

// ─── Core Function ──────────────────────────────────────────

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetIn: number; // seconds until reset
    limit: number;
}

/**
 * Check if a request is within its rate limit.
 * @param ip      - Client IP address
 * @param category - Rate limit category (determines limits)
 * @returns Whether the request is allowed and rate limit metadata
 */
export function checkRateLimit(ip: string, category: RateLimitCategory): RateLimitResult {
    cleanup();

    const config = RATE_LIMITS[category];
    const key = `${ip}:${category}`;
    const now = Date.now();

    const entry = store.get(key);

    // No existing entry — create one
    if (!entry || now > entry.resetTime) {
        store.set(key, {
            count: 1,
            resetTime: now + config.windowSeconds * 1000,
        });
        return {
            allowed: true,
            remaining: config.maxRequests - 1,
            resetIn: config.windowSeconds,
            limit: config.maxRequests,
        };
    }

    // Existing entry — increment count
    entry.count++;
    const resetIn = Math.ceil((entry.resetTime - now) / 1000);

    if (entry.count > config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetIn,
            limit: config.maxRequests,
        };
    }

    return {
        allowed: true,
        remaining: config.maxRequests - entry.count,
        resetIn,
        limit: config.maxRequests,
    };
}

/**
 * Determine the rate limit category for a given pathname.
 */
export function getCategory(pathname: string): RateLimitCategory {
    // Auth endpoints
    if (pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/api/auth')) {
        return 'auth';
    }

    // Upload endpoint
    if (pathname.startsWith('/api/upload')) {
        return 'upload';
    }

    // Other API routes
    if (pathname.startsWith('/api/')) {
        return 'api';
    }

    // Next.js Server Actions (POST to page routes)
    // These are detected by the middleware via headers, not path

    // General page requests
    return 'general';
}
