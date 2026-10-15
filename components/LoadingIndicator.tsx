import { Loader2 } from "lucide-react";

/** Indikator loading sederhana dengan pesan sesuai proses aktual (tanpa persentase palsu). */
export default function LoadingIndicator({
  text = "Sedang diproses…",
}: {
  text?: string;
}) {
  return (
    <p
      className="flex items-center gap-2 text-sm text-muted"
      aria-live="polite"
    >
      <Loader2 size={16} className="animate-spin text-accent-strong" aria-hidden="true" />
      {text}
    </p>
  );
}
