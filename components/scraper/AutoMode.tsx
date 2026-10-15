"use client";

import { useRef, useState } from "react";
import { CheckCircle2, CircleDashed, Loader2, Square, XCircle, Zap } from "lucide-react";
import CopyButton from "@/components/CopyButton";
import LoadingIndicator from "@/components/LoadingIndicator";
import ResultPanel from "@/components/ResultPanel";
import { postJson } from "@/lib/client";
import type { ApiResponse, GeneratedAccount } from "@/types/scraper";
import { btnPrimary, btnSecondary } from "./styles";

type ItemStatus = "menunggu" | "proses" | "berhasil" | "gagal";

interface AutoItem {
  index: number;
  status: ItemStatus;
  data?: GeneratedAccount | null;
  error?: string;
}

const COUNTS = [1, 2, 3, 4, 5];

/**
 * Mode otomatis: buat akun penuh otomatis.
 * Karena satu akun bisa memakan waktu hingga ±1 menit, beberapa akun
 * diproses berurutan dari sisi klien agar tidak melampaui batas runtime
 * satu Vercel Function (60 detik).
 */
export default function AutoMode() {
  const [count, setCount] = useState(1);
  const [items, setItems] = useState<AutoItem[]>([]);
  const [running, setRunning] = useState(false);
  const cancelRef = useRef(false);

  const finished = items.length > 0 && !running;
  const successes = items.filter((i) => i.status === "berhasil");

  async function start() {
    cancelRef.current = false;
    setRunning(true);
    setItems(
      Array.from({ length: count }, (_, i) => ({
        index: i + 1,
        status: "menunggu" as ItemStatus,
      }))
    );

    const results: AutoItem[] = [];
    for (let i = 1; i <= count; i++) {
      if (cancelRef.current) break;
      setItems((prev) =>
        prev.map((it) =>
          it.index === i ? { ...it, status: "proses" } : it
        )
      );
      try {
        const res = await postJson<GeneratedAccount>("/api/alightmotion/generate");
        results.push({ index: i, status: "berhasil", data: res.data });
      } catch (error) {
        results.push({
          index: i,
          status: "gagal",
          error: error instanceof Error ? error.message : "Kesalahan tak diketahui.",
        });
      }
      setItems((prev) =>
        prev.map((it) => {
          const found = results.find((r) => r.index === it.index);
          return found ? { ...it, ...found } : it;
        })
      );
    }
    setRunning(false);
  }

  function reset() {
    cancelRef.current = true;
    setRunning(false);
    setItems([]);
  }

  const inProgress = items.find((i) => i.status === "proses");

  return (
    <div className="space-y-5">
      <section aria-labelledby="auto-jumlah">
        <h3 id="auto-jumlah" className="text-sm font-medium text-ink">
          Jumlah akun
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">
          Setiap akun dibuat satu per satu dan dapat memakan waktu hingga ±1
          menit. Total waktu menyesuaikan jumlah akun.
        </p>
        <div
          role="radiogroup"
          aria-label="Jumlah akun yang akan dibuat"
          className="mt-3 flex flex-wrap gap-2"
        >
          {COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={count === n}
              onClick={() => setCount(n)}
              disabled={running}
              className={`h-11 w-11 rounded-md border text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                count === n
                  ? "border-accent bg-accent/15 text-ink"
                  : "border-line bg-surface text-muted hover:text-ink"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className={btnPrimary}
          onClick={() => void start()}
          disabled={running}
        >
          <Zap size={16} aria-hidden="true" />
          {running ? "Sedang membuat…" : "Buat Akun"}
        </button>
        {running ? (
          <button type="button" className={btnSecondary} onClick={() => (cancelRef.current = true)}>
            <Square size={14} aria-hidden="true" />
            Hentikan
          </button>
        ) : (
          items.length > 0 && (
            <button type="button" className={btnSecondary} onClick={reset}>
              Atur Ulang
            </button>
          )
        )}
      </div>

      {running && inProgress && (
        <LoadingIndicator
          text={`Sedang membuat akun ${inProgress.index} dari ${count}. Proses mencari link verifikasi di email sementara; ini memang memakan waktu.`}
        />
      )}

      {items.length > 0 && (
        <section aria-label="Progres pembuatan akun" className="space-y-2">
          <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
            {items.map((item) => (
              <li
                key={item.index}
                className="flex items-start gap-3 px-3.5 py-3 text-sm"
              >
                <span className="mt-0.5 shrink-0" aria-hidden="true">
                  {item.status === "menunggu" && (
                    <CircleDashed size={16} className="text-muted" />
                  )}
                  {item.status === "proses" && (
                    <Loader2 size={16} className="animate-spin text-accent-strong" />
                  )}
                  {item.status === "berhasil" && <CheckCircle2 size={16} className="text-ok" />}
                  {item.status === "gagal" && <XCircle size={16} className="text-bad" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">Akun #{item.index}</span>
                    <span
                      className={
                        item.status === "berhasil"
                          ? "text-ok"
                          : item.status === "gagal"
                            ? "text-bad"
                            : "text-muted"
                      }
                    >
                      {item.status === "menunggu"
                        ? "Menunggu antrean"
                        : item.status === "proses"
                          ? "Sedang dibuat"
                          : item.status === "berhasil"
                            ? "Berhasil"
                            : "Gagal"}
                    </span>
                  </p>
                  {item.data?.email && (
                    <p className="mt-0.5 break-all font-mono text-xs text-muted">
                      {item.data.email}
                    </p>
                  )}
                  {item.error && (
                    <p className="mt-0.5 text-xs text-bad" role="alert">{item.error}</p>
                  )}
                </div>
                {item.data?.email && (
                  <CopyButton
                    value={JSON.stringify(item.data, null, 2)}
                    label={`Salin hasil akun ${item.index}`}
                  />
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted" aria-live="polite">
            {successes.length} dari {items.length} akun berhasil dibuat.
          </p>
        </section>
      )}

      {finished && (
        <ResultPanel
          title="Hasil lengkap (JSON)"
          state={successes.length > 0 ? "ok" : "error"}
          data={{
            total_requested: items.length,
            total_success: successes.length,
            total_failed: items.length - successes.length,
            accounts: successes.map((s) => s.data),
            errors: items
              .filter((i) => i.status === "gagal")
              .map((i) => ({ index: i.index, error: i.error })),
          }}
          error="Tidak ada akun yang berhasil dibuat. Periksa status layanan lalu coba lagi."
        />
      )}
    </div>
  );
}
