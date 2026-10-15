import { NextResponse } from "next/server";
import axios from "axios";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_URL = "https://am.kyzzz.xyz";

interface HealthBody {
  success: boolean;
  data: {
    status: "tersedia" | "gangguan" | "tidak-diketahui";
    upstream: string;
    checkedAt: string;
    latencyMs: number | null;
  };
  message: string;
}

/**
 * Pemeriksaan kesehatan layanan.
 * Benar-benar menghubungi layanan hulu; status bukan sekadar "frontend termuat".
 */
export async function GET() {
  const startedAt = Date.now();
  try {
    const response = await axios.get(BASE_URL, {
      timeout: 5000,
      validateStatus: () => true,
    });
    const latencyMs = Date.now() - startedAt;
    // Host menjawab (termasuk jawaban 4xx/5xx) dianggap layanan aktif.
    const body: HealthBody = {
      success: true,
      data: {
        status: "tersedia",
        upstream: BASE_URL,
        checkedAt: new Date().toISOString(),
        latencyMs,
      },
      message: "Layanan scraping aktif dan menjawab.",
    };
    return NextResponse.json(body);
  } catch {
    const body: HealthBody = {
      success: true,
      data: {
        status: "gangguan",
        upstream: BASE_URL,
        checkedAt: new Date().toISOString(),
        latencyMs: null,
      },
      message: "Layanan hulu tidak merespons. Coba beberapa saat lagi.",
    };
    return NextResponse.json(body);
  }
}
