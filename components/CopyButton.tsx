"use client";

import { useState } from "react";
import { Check, Copy, X } from "lucide-react";

interface CopyButtonProps {
  /** Teks yang akan disalin */
  value: string;
  /** Label aksesibel; default "Salin hasil" */
  label?: string;
}

type CopyState = "idle" | "ok" | "err";

/** Tombol salin dengan Clipboard API + fallback, notifikasi hanya setelah operasi selesai. */
export default function CopyButton({ value, label = "Salin hasil" }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  async function handleCopy() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        // Fallback untuk konteks non-secure (mis. http lokal)
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(textarea);
        if (!ok) throw new Error("copy gagal");
      }
      setState("ok");
    } catch {
      setState("err");
    }
    window.setTimeout(() => setState("idle"), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={state === "ok" ? "Tersalin" : state === "err" ? "Gagal menyalin" : label}
      className="inline-flex h-9 min-w-11 items-center justify-center gap-1.5 rounded-md border border-line bg-surface px-3 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-ink"
    >
      {state === "ok" ? (
        <Check size={14} className="text-ok" aria-hidden="true" />
      ) : state === "err" ? (
        <X size={14} className="text-bad" aria-hidden="true" />
      ) : (
        <Copy size={14} aria-hidden="true" />
      )}
      <span aria-hidden="true">
        {state === "ok" ? "Tersalin" : state === "err" ? "Gagal" : "Salin"}
      </span>
      <span className="sr-only" aria-live="polite">
        {state === "ok"
          ? "Hasil tersalin ke papan klip."
          : state === "err"
            ? "Gagal menyalin ke papan klip."
            : ""}
      </span>
    </button>
  );
}
