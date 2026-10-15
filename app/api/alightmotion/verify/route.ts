import { verifyAccount } from "@/lib/scraper";
import { apiFail, apiOk, readJsonBody, safeErrorMessage } from "@/lib/api";
import { checkRateLimit, getClientIp, sweepBuckets } from "@/lib/rate-limit";
import { isValidEmail, isValidHttpUrl, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/alightmotion/verify — verifikasi magic link akun */
export async function POST(request: Request) {
  sweepBuckets();

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`verify:${ip}`, 8, 60_000);
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

  const email = sanitizeText(body.email);
  const link = sanitizeText(body.link);
  if (!email || !isValidEmail(email)) {
    return apiFail("Alamat email valid diperlukan.", 400);
  }
  if (!link || !isValidHttpUrl(link)) {
    return apiFail("Link verifikasi (http/https) diperlukan.", 400);
  }

  try {
    const result = await verifyAccount(email, link);
    return apiOk(result, "Verifikasi berhasil diproses.");
  } catch (error) {
    return apiFail(safeErrorMessage(error), 502);
  }
}
