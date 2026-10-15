import axios from "axios";
import type {
  GeneratedAccount,
  GuerrillaMail,
  InboxMessage,
  SendLinkResult,
  VerifyResult,
} from "@/types/scraper";

/**
 * Port TypeScript dari scraper sumber:
 * https://github.com/KyuuX444/scraper/blob/main/tools/alightmotion.js
 * Perilaku inti dipertahankan sama dengan sumber aslinya.
 */

const BASE_URL = "https://am.kyzzz.xyz";
const GUERRILLA_BASE = "https://api.guerrillamail.com/ajax.php";

const HEADERS = {
  "Content-Type": "application/json",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
} as const;

/** Batas aman di bawah durasi maksimum Vercel Function (60 dtk pada konfigurasi ini) */
const WAIT_TIMEOUT_DEFAULT = 45;

export class ScraperError extends Error {}

/** Buat email sementara dari Guerrilla Mail */
export async function createGuerrillaMail(): Promise<GuerrillaMail> {
  try {
    const { data } = await axios.get(`${GUERRILLA_BASE}?f=get_email_address`, {
      timeout: 15000,
    });
    const email = data?.email_addr;
    const sid = data?.sid_token;
    if (!email || !sid)
      throw new ScraperError("Gagal membuat temporary email Guerrilla.");
    return { email, sid, alias: data?.alias || "" };
  } catch (error) {
    if (error instanceof ScraperError) throw error;
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new ScraperError(err.response?.data?.error || err.message || "Kesalahan tidak diketahui.");
  }
}

/** Baca kotak masuk email Guerrilla (maks. 5 pesan terbaru) */
export async function readInbox(emailAddress: string): Promise<InboxMessage[]> {
  if (!emailAddress) {
    throw new ScraperError("Alamat email atau username Guerrilla harus diisi.");
  }

  const username = emailAddress.includes("@")
    ? emailAddress.split("@")[0]
    : emailAddress;

  try {
    const { data: initData } = await axios.get(
      `${GUERRILLA_BASE}?f=get_email_address`,
      { timeout: 15000 }
    );
    const sid = initData?.sid_token;
    if (!sid) throw new ScraperError("Gagal inisialisasi sesi Guerrilla Mail.");

    await axios.get(
      `${GUERRILLA_BASE}?f=set_email_user&email_user=${encodeURIComponent(username)}&sid_token=${sid}`,
      { timeout: 15000 }
    );

    const { data: chkData } = await axios.get(
      `${GUERRILLA_BASE}?f=check_email&seq=0&sid_token=${sid}`,
      { timeout: 15000 }
    );
    const list = (chkData?.list || []).filter(
      (item: { mail_id: string | number }) => String(item.mail_id) !== "1"
    );

    const messages: InboxMessage[] = [];
    for (const msg of list.slice(0, 5)) {
      const { data: mailDetail } = await axios.get(
        `${GUERRILLA_BASE}?f=fetch_email&email_id=${msg.mail_id}&sid_token=${sid}`,
        { timeout: 15000 }
      );
      const body = mailDetail?.mail_body || msg.mail_excerpt || "";
      const urls: string[] = body.match(/https?:\/\/[^\s"'<>]+/g) || [];
      const magic = urls.find(
        (u) =>
          u.includes("oobCode") ||
          u.includes("alight") ||
          u.includes("apiKey") ||
          u.includes("signInWithEmailLink")
      );

      messages.push({
        id: msg.mail_id,
        from: msg.mail_from || "-",
        subject: msg.mail_subject || "-",
        date: msg.mail_date || "-",
        excerpt: msg.mail_excerpt || "",
        magicLink: magic ? magic.replace(/&amp;/g, "&") : null,
      });
    }

    return messages;
  } catch (error) {
    if (error instanceof ScraperError) throw error;
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    throw new ScraperError(err.response?.data?.error || err.message || "Kesalahan tidak diketahui.");
  }
}

/** Tunggu dan ambil magic link dari kotak masuk Guerrilla (polling) */
export async function waitMagicLinkGuerrilla(
  sid: string,
  timeoutSec: number = WAIT_TIMEOUT_DEFAULT
): Promise<string> {
  if (!sid) throw new ScraperError("Token sesi Guerrilla diperlukan.");
  const maxTime = Math.min(timeoutSec, WAIT_TIMEOUT_DEFAULT) * 1000;
  const start = Date.now();

  while (Date.now() - start < maxTime) {
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const { data } = await axios.get(
      `${GUERRILLA_BASE}?f=check_email&seq=0&sid_token=${sid}`,
      { timeout: 15000 }
    );
    const list = data?.list || [];

    const amMsg = list.find(
      (m: { mail_subject?: string; mail_from?: string }) => {
        const subject = (m.mail_subject || "").toLowerCase();
        const from = (m.mail_from || "").toLowerCase();
        return (
          subject.includes("alight") ||
          subject.includes("sign in") ||
          from.includes("firebase") ||
          from.includes("alight")
        );
      }
    );

    if (amMsg) {
      const { data: mailDetail } = await axios.get(
        `${GUERRILLA_BASE}?f=fetch_email&email_id=${amMsg.mail_id}&sid_token=${sid}`,
        { timeout: 15000 }
      );
      const body = mailDetail?.mail_body || "";
      const urls: string[] = body.match(/https?:\/\/[^\s"'<>]+/g) || [];
      const magic = urls.find(
        (u) =>
          u.includes("oobCode") ||
          u.includes("alight") ||
          u.includes("apiKey") ||
          u.includes("signInWithEmailLink")
      );
      if (magic) {
        return magic.replace(/&amp;/g, "&");
      }
    }
  }

  throw new ScraperError(
    "Timeout menunggu link verifikasi dari Alight Motion. Coba mode manual atau ulangi sesaat lagi."
  );
}

/** Kirim link verifikasi ke email target */
export async function sendVerificationLink(email: string): Promise<SendLinkResult> {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/send-link`,
      { email: email.trim() },
      { headers: HEADERS, timeout: 20000 }
    );
    return data as SendLinkResult;
  } catch (error) {
    const err = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
    throw new ScraperError(
      err.response?.data?.error || err.response?.data?.message || err.message || "Kesalahan tidak diketahui."
    );
  }
}

/** Verifikasi magic link untuk mengaktifkan akun */
export async function verifyAccount(email: string, link: string): Promise<VerifyResult> {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/api/verify`,
      { email: email.trim(), link: link.trim() },
      { headers: HEADERS, timeout: 25000 }
    );
    return data as VerifyResult;
  } catch (error) {
    const err = error as { response?: { data?: { error?: string; message?: string } }; message?: string };
    throw new ScraperError(
      err.response?.data?.error || err.response?.data?.message || err.message || "Kesalahan tidak diketahui."
    );
  }
}

/** Buat 1 akun Alight Motion Pro secara penuh otomatis */
export async function generateAccount(): Promise<GeneratedAccount> {
  const { email, sid } = await createGuerrillaMail();
  await sendVerificationLink(email);
  const magicLink = await waitMagicLinkGuerrilla(sid, WAIT_TIMEOUT_DEFAULT);
  const verifData = await verifyAccount(email, magicLink);

  return {
    status: true,
    email,
    orderId: verifData?.orderId || null,
    uid: verifData?.uid || null,
    isNewUser: verifData?.isNewUser ?? true,
    magicLink,
  };
}
