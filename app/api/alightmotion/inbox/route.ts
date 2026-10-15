import { readInbox } from "@/lib/scraper";
import { apiFail, apiOk, readJsonBody, safeErrorMessage } from "@/lib/api";
import { checkRateLimit, getClientIp, sweepBuckets } from "@/lib/rate-limit";
import { isValidGuerrillaAddress, sanitizeText } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/alightmotion/inbox — baca kotak masuk email sementara */
export async function POST(request: Request) {
  sweepBuckets();

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`inbox:${ip}`, 10, 60_000);
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
  if (!email || !isValidGuerrillaAddress(email)) {
    return apiFail("Alamat email atau username Guerrilla harus diisi.", 400);
  }

  try {
    const messages = await readInbox(email);
    return apiOk({ messages }, "Kotak masuk berhasil dibaca.");
  } catch (error) {
    return apiFail(safeErrorMessage(error), 502);
  }
}
