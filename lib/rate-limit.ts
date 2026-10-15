/**
 * Rate limiting sederhana berbasis memori proses.
 *
 * CATATAN PENTING: Vercel Functions tidak menjamin satu proses yang sama
 * menangani seluruh request, sehingga mekanisme ini bersifat best-effort,
 * bukan jaminan ketat lintas instance. Untuk rate limiting terpusat yang
 * andal, gunakan penyimpanan bersama (mis. Upstash Redis) — lihat README.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/** Bersihkan bucket kedaluwarsa agar Map tidak membengkak */
export function sweepBuckets(): void {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Ambil alamat IP klien dari header Vercel */
export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "tidak-diketahui"
  );
}
