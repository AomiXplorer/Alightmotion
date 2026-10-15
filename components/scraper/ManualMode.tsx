"use client";

import { useState } from "react";
import { Inbox, MailPlus, Send, ShieldCheck } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import ResultPanel from "@/components/ResultPanel";
import { postJson } from "@/lib/client";
import type {
  GuerrillaMail,
  InboxMessage,
  SendLinkResult,
  VerifyResult,
} from "@/types/scraper";
import { btnPrimary, stepDesc, stepTitle, textareaBase } from "./styles";

type AsyncState = "idle" | "loading" | "ok" | "error";

/**
 * Mode manual: kendali penuh per langkah — buat email, kirim link,
 * periksa kotak masuk, lalu verifikasi. Setiap langkah menampilkan
 * respons asli dari API dalam bentuk JSON.
 */
export default function ManualMode() {
  // Langkah 1: email sementara
  const [mail, setMail] = useState<GuerrillaMail | null>(null);
  const [mailState, setMailState] = useState<AsyncState>("idle");
  const [mailError, setMailError] = useState<string | null>(null);

  // Langkah 2: kirim link
  const [sendData, setSendData] = useState<SendLinkResult | null>(null);
  const [sendState, setSendState] = useState<AsyncState>("idle");
  const [sendError, setSendError] = useState<string | null>(null);

  // Langkah 3: kotak masuk
  const [messages, setMessages] = useState<InboxMessage[] | null>(null);
  const [inboxState, setInboxState] = useState<AsyncState>("idle");
  const [inboxError, setInboxError] = useState<string | null>(null);

  // Langkah 4: verifikasi
  const [linkInput, setLinkInput] = useState("");
  const [verifyData, setVerifyData] = useState<VerifyResult | null>(null);
  const [verifyState, setVerifyState] = useState<AsyncState>("idle");
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const email = mail?.email ?? "";
  const linkLooksValid = /^https?:\/\//.test(linkInput.trim());

  async function createMail() {
    setMailState("loading");
    setMailError(null);
    try {
      const res = await postJson<GuerrillaMail>("/api/alightmotion/email");
      if (!res.data) throw new Error("Data email sementara kosong.");
      setMail(res.data);
      setMailState("ok");
    } catch (error) {
      setMailState("error");
      setMailError(error instanceof Error ? error.message : "Kesalahan tak diketahui.");
    }
  }

  async function sendLink() {
    if (!email) return;
    setSendState("loading");
    setSendError(null);
    try {
      const res = await postJson<SendLinkResult>("/api/alightmotion/send-link", {
        email,
      });
      setSendData(res.data ?? {});
      setSendState("ok");
    } catch (error) {
      setSendState("error");
      setSendError(error instanceof Error ? error.message : "Kesalahan tak diketahui.");
    }
  }

  async function refreshInbox() {
    if (!email) return;
    setInboxState("loading");
    setInboxError(null);
    try {
      const res = await postJson<{ messages: InboxMessage[] }>(
        "/api/alightmotion/inbox",
        { email }
      );
      if (!res.data) throw new Error("Data kotak masuk kosong.");
      setMessages(res.data.messages);
      setInboxState("ok");
    } catch (error) {
      setInboxState("error");
      setInboxError(error instanceof Error ? error.message : "Kesalahan tak diketahui.");
    }
  }

  async function verify() {
    const link = linkInput.trim();
    if (!email || !link) return;
    setVerifyState("loading");
    setVerifyError(null);
    try {
      const res = await postJson<VerifyResult>("/api/alightmotion/verify", {
        email,
        link,
      });
      setVerifyData(res.data ?? {});
      setVerifyState("ok");
    } catch (error) {
      setVerifyState("error");
      setVerifyError(error instanceof Error ? error.message : "Kesalahan tak diketahui.");
    }
  }

  function resetAll() {
    setMail(null);
    setMailState("idle");
    setMailError(null);
    setSendData(null);
    setSendState("idle");
    setSendError(null);
    setMessages(null);
    setInboxState("idle");
    setInboxError(null);
    setLinkInput("");
    setVerifyData(null);
    setVerifyState("idle");
    setVerifyError(null);
  }

  return (
    <div className="space-y-8">
      {/* Langkah 1 */}
      <section aria-labelledby="langkah-1">
        <h3 id="langkah-1" className={stepTitle}>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-muted"
            aria-hidden="true"
          >
            1
          </span>
          Buat email sementara
        </h3>
        <p className={stepDesc}>
          Email sementara dibuat lewat Guerrilla Mail dan dipakai untuk
          menerima link verifikasi Alight Motion.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void createMail()}
            disabled={mailState === "loading"}
          >
            <MailPlus size={16} aria-hidden="true" />
            {mail ? "Buat email baru" : "Buat Email Sementara"}
          </button>
          {mail && (
            <p className="flex min-h-11 flex-wrap items-center gap-2 text-sm">
              <span className="break-all rounded-md border border-line bg-surface px-3 py-2 font-mono text-xs text-ink">
                {mail.email}
              </span>
              <CopyButton value={mail.email} label="Salin alamat email" />
            </p>
          )}
        </div>
        {mailState === "loading" && (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            Membuat email sementara…
          </p>
        )}
        {mailState === "error" && (
          <p className="mt-3 text-sm text-bad" role="alert">{mailError}</p>
        )}
        {mail && (
          <div className="mt-3">
            <ResultPanel title="Respons email sementara (JSON)" state="ok" data={mail} />
          </div>
        )}
      </section>

      {/* Langkah 2 */}
      <section aria-labelledby="langkah-2">
        <h3 id="langkah-2" className={stepTitle}>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-muted"
            aria-hidden="true"
          >
            2
          </span>
          Kirim link verifikasi
        </h3>
        <p className={stepDesc}>
          Layanan akan mengirim link verifikasi ke email di atas. Pastikan
          langkah 1 sudah selesai.
        </p>
        <div className="mt-3">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void sendLink()}
            disabled={!email || sendState === "loading"}
          >
            <Send size={16} aria-hidden="true" />
            Kirim Link Verifikasi
          </button>
        </div>
        {sendState === "loading" && (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            Mengirim link verifikasi…
          </p>
        )}
        {sendState === "error" && (
          <p className="mt-3 text-sm text-bad" role="alert">{sendError}</p>
        )}
        {sendData && (
          <div className="mt-3">
            <ResultPanel title="Respons pengiriman link (JSON)" state="ok" data={sendData} />
          </div>
        )}
      </section>

      {/* Langkah 3 */}
      <section aria-labelledby="langkah-3">
        <h3 id="langkah-3" className={stepTitle}>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-muted"
            aria-hidden="true"
          >
            3
          </span>
          Periksa kotak masuk
        </h3>
        <p className={stepDesc}>
          Email verifikasi biasanya tiba dalam 10–60 detik. Jika kosong,
          tunggu sebentar lalu periksa ulang.
        </p>
        <div className="mt-3">
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void refreshInbox()}
            disabled={!email || inboxState === "loading"}
          >
            <Inbox size={16} aria-hidden="true" />
            Periksa Kotak Masuk
          </button>
        </div>
        {inboxState === "loading" && (
          <p className="mt-3 text-sm text-muted" aria-live="polite">
            Membaca kotak masuk…
          </p>
        )}
        {inboxState === "error" && (
          <p className="mt-3 text-sm text-bad" role="alert">{inboxError}</p>
        )}
        {inboxState === "ok" && messages && (
          <div className="mt-3 space-y-3">
            {messages.length === 0 ? (
              <p className="rounded-lg border border-line bg-surface px-3.5 py-3 text-sm text-muted">
                Kotak masuk masih kosong. Tunggu sebentar, lalu periksa ulang.
              </p>
            ) : (
              <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
                {messages.map((msg) => (
                  <li key={msg.id} className="px-3.5 py-3">
                    <p className="text-sm font-medium">{msg.subject}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {msg.from} · {msg.date}
                    </p>
                    {msg.magicLink ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="min-w-0 break-all rounded-md border border-ok/30 bg-ok/10 px-2.5 py-1.5 font-mono text-xs text-ok">
                          Link verifikasi ditemukan
                        </span>
                        <CopyButton value={msg.magicLink} label="Salin link verifikasi" />
                        <button
                          type="button"
                          className="inline-flex h-9 min-w-11 items-center justify-center rounded-md bg-accent px-3 text-xs font-medium text-white transition-colors hover:bg-accent-strong/90"
                          onClick={() => setLinkInput(msg.magicLink as string)}
                        >
                          Gunakan link ini
                        </button>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-muted">
                        Tidak ada link verifikasi pada pesan ini.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <ResultPanel
              title="Respons kotak masuk (JSON)"
              state="ok"
              data={{ messages }}
            />
          </div>
        )}
      </section>

      {/* Langkah 4 */}
      <section aria-labelledby="langkah-4">
        <h3 id="langkah-4" className={stepTitle}>
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-xs text-muted"
            aria-hidden="true"
          >
            4
          </span>
          Verifikasi akun
        </h3>
        <p className={stepDesc}>
          Tempel link verifikasi lengkap (dimulai dengan http), lalu jalankan
          verifikasi untuk mengaktifkan akun.
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <label htmlFor="magic-link" className="mb-1.5 block text-xs font-medium text-muted">
              Link verifikasi
            </label>
            <textarea
              id="magic-link"
              className={textareaBase}
              rows={3}
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="https://… (tempel link lengkap di sini)"
              spellCheck={false}
              autoCapitalize="none"
              disabled={!email}
            />
          </div>
          <button
            type="button"
            className={btnPrimary}
            onClick={() => void verify()}
            disabled={!email || !linkLooksValid || verifyState === "loading"}
          >
            <ShieldCheck size={16} aria-hidden="true" />
            Verifikasi Akun
          </button>
          {linkInput.length > 0 && !linkLooksValid && (
            <p className="text-xs text-warn" role="alert">
              Link harus dimulai dengan http:// atau https://
            </p>
          )}
          {verifyState === "loading" && (
            <p className="text-sm text-muted" aria-live="polite">
              Memverifikasi akun…
            </p>
          )}
          {verifyState === "error" && (
            <p className="text-sm text-bad" role="alert">{verifyError}</p>
          )}
        </div>
        {verifyState === "ok" && verifyData && (
          <div className="mt-3">
            <ResultPanel title="Hasil verifikasi (JSON)" state="ok" data={verifyData} />
          </div>
        )}
      </section>

      {(mail || messages || verifyData) && (
        <button
          type="button"
          onClick={resetAll}
          className="inline-flex h-11 items-center rounded-md border border-line bg-surface px-4 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          Atur ulang seluruh langkah
        </button>
      )}
    </div>
  );
}
