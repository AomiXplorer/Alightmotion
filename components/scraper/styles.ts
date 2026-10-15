/** Kelas gaya bersama untuk kontrol form dan tombol (design system konsisten). */

export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong/90 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-50";

export const inputBase =
  "h-11 w-full rounded-md border border-line bg-surface px-3.5 text-sm text-ink placeholder:text-muted/60 focus-visible:outline-accent disabled:opacity-50";

export const textareaBase =
  "w-full rounded-md border border-line bg-surface p-3.5 font-mono text-xs leading-relaxed text-ink placeholder:text-muted/60 focus-visible:outline-accent disabled:opacity-50";

export const stepTitle =
  "flex items-center gap-2.5 text-base font-semibold text-ink";

export const stepDesc = "mt-1 text-sm leading-relaxed text-muted";
