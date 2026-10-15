import type { ApiResponse } from "@/types/scraper";

/** Klien fetch ringan untuk memanggil API internal dengan format respons standar. */

export async function postJson<T>(
  url: string,
  body: Record<string, unknown> = {}
): Promise<ApiResponse<T>> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseResponse<T>(res);
}

export async function getJson<T>(url: string): Promise<ApiResponse<T>> {
  const res = await fetch(url, { method: "GET" });
  return parseResponse<T>(res);
}

async function parseResponse<T>(res: Response): Promise<ApiResponse<T>> {
  let parsed: ApiResponse<T> | null = null;
  try {
    parsed = (await res.json()) as ApiResponse<T>;
  } catch {
    parsed = null;
  }
  if (!res.ok || !parsed || !parsed.success) {
    throw new Error(
      parsed?.message || `Permintaan gagal (HTTP ${res.status}).`
    );
  }
  return parsed;
}
