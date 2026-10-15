import { generateAccount } from "@/lib/scraper";
import { apiFail, apiOk, readJsonBody, safeErrorMessage } from "@/lib/api";
import { checkRateLimit, getClientIp, sweepBuckets } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/**
 * Durasi maksimum 60 dtk (batas Vercel Hobby untuk Node.js Functions).
 * generateAccount mem-polling kotak masuk hingga maks. 45 dtk,
 * lalu verifikasi (timeout 25 dtk pada tiap panggilan hulu).
 */
export const maxDuration = 60;

/** POST /api/alightmotion/generate — buat 1 akun Alight Motion Pro penuh otomatis */
export async function POST(request: Request) {
  sweepBuckets();

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`generate:${ip}`, 3, 60_000);
  if (!limit.allowed) {
    return apiFail(
      `Terlalu banyak permintaan. Coba lagi dalam ${limit.retryAfterSec} detik.`,
      429
    );
  }

  const body = await readJsonBody(request);
  if (body === null) {
    return apiFail("Body permintaan harus berupa JSON yang valid.", 400);
  }

  try {
    const account = await generateAccount();
    return apiOk(account, "Akun berhasil dibuat dan diverifikasi.");
  } catch (error) {
    return apiFail(safeErrorMessage(error), 502);
  }
}
