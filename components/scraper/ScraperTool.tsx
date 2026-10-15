"use client";

import { useState } from "react";
import AutoMode from "./AutoMode";
import ManualMode from "./ManualMode";

type Mode = "otomatis" | "manual";

const TABS: Array<{ id: Mode; label: string; hint: string }> = [
  {
    id: "otomatis",
    label: "Otomatis",
    hint: "Sekali klik, sistem membuat email, menunggu link, dan memverifikasi akun.",
  },
  {
    id: "manual",
    label: "Manual",
    hint: "Kendali penuh per langkah: buat email, kirim link, cek inbox, verifikasi.",
  },
];

export default function ScraperTool() {
  const [mode, setMode] = useState<Mode>("otomatis");
  const active = TABS.find((t) => t.id === mode);

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        aria-label="Mode scraper"
        className="flex gap-2 rounded-lg border border-line bg-surface p-1.5"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={mode === tab.id}
            onClick={() => setMode(tab.id)}
            className={`h-10 flex-1 rounded-md text-sm font-medium transition-colors ${
              mode === tab.id
                ? "bg-accent text-white"
                : "text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className="text-sm leading-relaxed text-muted">{active?.hint}</p>

      {mode === "otomatis" ? <AutoMode /> : <ManualMode />}
    </div>
  );
}
