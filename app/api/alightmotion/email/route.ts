import { createGuerrillaMail } from "@/lib/scraper";
import { apiFail, apiOk, readJsonBody, safeErrorMessage } from "@/lib/api";
import { checkRateLimit, getClientIp, sweepBuckets } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** POST /api/alightmotion/email — buat email sementara Guerrilla Mail */
export async function POST(request: Request) {
  sweepBuckets();

  const ip = getClientIp(request.headers);
  const limit = checkRateLimit(`email:${ip}`, 6, 60_000);
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
    const mail = await createGuerrillaMail();
    return apiOk(mail, "Email sementara berhasil dibuat.");
  } catch (error) {
    return apiFail(safeErrorMessage(error), 502);
  }
}
