"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getJson } from "@/lib/client";

type ServiceState = "memeriksa" | "tersedia" | "gangguan" | "tidak-diketahui";

interface HealthData {
  status: Exclude<ServiceState, "memeriksa">;
  upstream: string;
  checkedAt: string;
  latencyMs: number | null;
}

/** Indikator status layanan, diambil dari pemeriksaan kesehatan API sungguhan. */
export default function ServiceStatus() {
  const [state, setState] = useState<ServiceState>("memeriksa");
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [latency, setLatency] = useState<number | null>(null);

  const check = useCallback(async () => {
    setState("memeriksa");
    try {
      const res = await getJson<HealthData>("/api/health");
      if (!res.data) throw new Error("Data kesehatan kosong.");
      setState(res.data.status);
      setCheckedAt(
        new Date(res.data.checkedAt).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setLatency(res.data.latencyMs);
    } catch {
      setState("tidak-diketahui");
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return (
    <section
      aria-label="Status layanan"
      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-surface px-4 py-3"
    >
      <p className="flex flex-wrap items-center gap-2.5 text-sm">
        <span
          aria-hidden="true"
          className={`h-2 w-2 shrink-0 rounded-full ${
            state === "tersedia"
              ? "bg-ok"
              : state === "gangguan" || state === "tidak-diketahui"
                ? "bg-bad"
                : "bg-warn"
          }`}
        />
        <span className="font-medium">
          {state === "tersedia"
            ? "Layanan tersedia"
            : state === "gangguan"
              ? "Layanan mengalami gangguan"
              : state === "tidak-diketahui"
                ? "Status belum diketahui"
                : "Memeriksa status…"}
        </span>
        {state === "tersedia" && latency !== null && (
          <span className="text-muted">
            · {latency} mdtk{checkedAt ? ` · diperiksa ${checkedAt}` : ""}
          </span>
        )}
      </p>
      <span className="sr-only" aria-live="polite">
        {state === "tersedia"
          ? "Layanan scraping tersedia."
          : state === "gangguan"
            ? "Layanan hulu mengalami gangguan."
            : state === "tidak-diketahui"
              ? "Status layanan belum diketahui."
              : "Sedang memeriksa status layanan."}
      </span>

      <button
        type="button"
        onClick={() => void check()}
        disabled={state === "memeriksa"}
        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-line bg-raised px-3 text-xs font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
      >
        <RefreshCw
          size={13}
          className={state === "memeriksa" ? "animate-spin" : ""}
          aria-hidden="true"
        />
        Periksa ulang
      </button>
    </section>
  );
}
