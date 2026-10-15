import { sendVerificationLink } from "@/lib/scraper";
import { apiFail, apiOk, readJsonBody, safeErrorMessage } from "@/lib/api";
import { checkRateLimit, getClientIp, sweepBuckets } from "@/lib/rate-limit";
import { isValidEmail, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/alightmotion/send-link — kirim link verifikasi ke email */
export async function POST(request: Request) {
  sweepBuckets();

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`send-link:${ip}`, 5, 60_000);
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
  if (!email || !isValidEmail(email)) {
    return apiFail("Alamat email valid diperlukan.", 400);
  }

  try {
    const result = await sendVerificationLink(email);
    return apiOk(result, "Link verifikasi berhasil dikirim.");
  } catch (error) {
    return apiFail(safeErrorMessage(error), 502);
  }
}
