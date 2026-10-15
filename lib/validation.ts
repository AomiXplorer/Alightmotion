/** Validasi dan pembersihan input. Terpisah dari proses scraping. */

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

/** Batas panjang agar input tidak membengkakkan request */
const MAX_INPUT = 2000;

export function sanitizeText(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_INPUT);
}

/** Validasi alamat email sederhana (hanya bentuk, bukan keberadaan) */
export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}

/** Validasi magic link: hanya http/https, panjang wajar, tanpa karakter kontrol */
export function isValidHttpUrl(candidate: string): boolean {
  if (!candidate || candidate.length > MAX_INPUT) return false;
  if (/[\s]/.test(candidate)) return false;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/** Validasi username/email Guerrilla (tanpa "@" pun diperbolehkan) */
export function isValidGuerrillaAddress(address: string): boolean {
  return address.length >= 3 && address.length <= 64 && /^[a-zA-Z0-9._@-]+$/.test(address);
}

/** Angka bulat pada rentang [min, max] */
export function toIntInRange(value: unknown, min: number, max: number, fallback: number): number {
  const n = typeof value === "string" ? parseInt(value, 10) : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.trunc(n), min), max);
}
