import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/scraper";

/** Pembuat respons JSON konsisten untuk seluruh endpoint API. */

const MAX_BODY_BYTES = 8 * 1024; // 8 KB cukup untuk payload endpoint ini

export function apiOk<T>(data: T, message = "Permintaan berhasil diproses") {
  const body: ApiResponse<T> = { success: true, data, message };
  return NextResponse.json(body, { status: 200 });
}

export function apiFail(message: string, status = 400) {
  const body: ApiResponse<null> = { success: false, data: null, message };
  return NextResponse.json(body, { status });
}

/**
 * Baca dan batasi ukuran body JSON.
 * Mengembalikan null bila body tidak valid/terlalu besar.
 */
export async function readJsonBody(
  request: Request
): Promise<Record<string, unknown> | null> {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return null;
  try {
    const text = await request.text();
    if (text.length > MAX_BODY_BYTES) return null;
    const parsed = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Ganti pesan error teknis agar tidak membocorkan detail internal */
export function safeErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message.slice(0, 300);
  }
  return "Terjadi kesalahan tak terduga saat memproses permintaan.";
}
