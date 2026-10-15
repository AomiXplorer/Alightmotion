import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Hero() {
  return (
    <section className="border-b border-line bg-surface/40">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <p className="text-xs font-medium text-accent-strong">
          Alat web oleh Aomi
        </p>
        <h1 className="mt-2 max-w-xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
          Buat akun Alight Motion melalui email sementara, otomatis.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
          Sistem membuat email sementara, mengirim link verifikasi, menunggu
          email masuk, lalu memverifikasi akun. Tersedia mode otomatis satu klik
          dan mode manual per langkah.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/scraper"
            className="inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong/90"
          >
            Mulai Scraper
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link
            href="/dokumentasi"
            className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-accent/50"
          >
            <BookOpen size={15} aria-hidden="true" />
            Dokumentasi
          </Link>
        </div>
      </div>
    </section>
  );
}
