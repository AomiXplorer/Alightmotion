"use client";

import CopyButton from "@/components/CopyButton";

type PanelState = "empty" | "loading" | "ok" | "error";

interface ResultPanelProps {
  /** Judul panel, mis. "Hasil verifikasi" */
  title: string;
  state: PanelState;
  /** Data apa pun yang akan dirender sebagai JSON (dipakai saat state ok) */
  data?: unknown;
  /** Pesan kesalahan (dipakai saat state error) */
  error?: string;
  /** Teks indikator loading */
  loadingText?: string;
}

/**
 * Panel hasil dengan state eksplisit: kosong, loading, sukses, atau gagal.
 * Hasil sukses dirender sebagai JSON monospace dan bisa disalin.
 */
export default function ResultPanel({
  title,
  state,
  data,
  error,
  loadingText,
}: ResultPanelProps) {
  return (
    <section
      aria-label={title}
      className="overflow-hidden rounded-lg border border-line bg-surface"
    >
      <header className="flex min-h-11 items-center justify-between gap-2 border-b border-line px-3.5 py-1.5">
        <h3 className="text-xs font-medium text-muted">{title}</h3>
        {state === "ok" && data !== undefined && (
          <CopyButton value={JSON.stringify(data, null, 2)} />
        )}
      </header>

      <div className="p-3.5">
        {state === "empty" && (
          <p className="text-sm text-muted">
            Belum ada hasil. Jalankan proses terlebih dahulu.
          </p>
        )}

        {state === "loading" && (
          <p className="text-sm text-muted" aria-live="polite">
            {loadingText || "Sedang diproses…"}
          </p>
        )}

        {state === "error" && (
          <p className="text-sm leading-relaxed text-bad" role="alert">
            {error || "Terjadi kesalahan."}
          </p>
        )}

        {state === "ok" && (
          <pre className="max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-md bg-raised p-3 font-mono text-xs leading-relaxed text-ink">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
      </div>
    </section>
  );
}
