import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Inbox,
  Layers,
  MailPlus,
  Send,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Hero from "@/components/Hero";
import ServiceStatus from "@/components/ServiceStatus";

export const metadata: Metadata = {
  title: "Beranda",
};

/** Daftar fitur yang benar-benar diimplementasikan dan terhubung ke API. */
const FEATURES = [
  {
    icon: MailPlus,
    name: "Email sementara otomatis",
    desc: "Dibuat lewat Guerrilla Mail tanpa perlu daftar apa pun.",
    href: "/scraper",
  },
  {
    icon: Send,
    name: "Kirim link verifikasi",
    desc: "Link verifikasi Alight Motion dikirim ke email sementara.",
    href: "/scraper",
  },
  {
    icon: Inbox,
    name: "Baca kotak masuk",
    desc: "Sistem mendeteksi link verifikasi dari isi email secara otomatis.",
    href: "/scraper",
  },
  {
    icon: ShieldCheck,
    name: "Verifikasi akun",
    desc: "Link diverifikasi untuk mengaktifkan akun, hasilnya ditampilkan apa adanya.",
    href: "/scraper",
  },
  {
    icon: Zap,
    name: "Mode otomatis",
    desc: "Sekali klik: buat email, tunggu link, verifikasi, selesai.",
    href: "/scraper",
  },
  {
    icon: Layers,
    name: "Hingga 5 akun sekaligus",
    desc: "Beberapa akun diproses berurutan dengan progres yang jelas.",
    href: "/scraper",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <div className="mx-auto max-w-5xl space-y-12 px-4 py-10">
        <ServiceStatus />

        <section aria-labelledby="fitur">
          <h2 id="fitur" className="text-lg font-semibold">
            Kemampuan yang terverifikasi
          </h2>
          <p className="mt-1.5 text-sm text-muted">
            Semua fitur di bawah sudah terhubung ke API scraper sungguhan.
          </p>
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <li key={feature.name}>
                <Link
                  href={feature.href}
                  className="flex h-full items-start gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-accent/50"
                >
                  <feature.icon
                    size={18}
                    className="mt-0.5 shrink-0 text-accent-strong"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{feature.name}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                      {feature.desc}
                    </span>
                  </span>
                  <ArrowRight
                    size={14}
                    className="mt-0.5 shrink-0 self-center text-muted"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="cara-kerja">
          <h2 id="cara-kerja" className="text-lg font-semibold">
            Cara kerja singkat
          </h2>
          <ol className="mt-4 list-decimal space-y-2.5 border-l-2 border-line pl-5 text-sm leading-relaxed text-muted marker:text-muted">
            <li>
              <span className="text-ink">Buat email sementara</span> — alamat
              Guerrilla Mail dibuat otomatis untuk Anda.
            </li>
            <li>
              <span className="text-ink">Kirim link verifikasi</span> — layanan
              mengirim email verifikasi Alight Motion.
            </li>
            <li>
              <span className="text-ink">Tunggu email masuk</span> — sistem
              memeriksa kotak masuk dan mengekstrak link verifikasi.
            </li>
            <li>
              <span className="text-ink">Verifikasi akun</span> — akun
              diverifikasi dan hasil lengkapnya bisa langsung disalin.
            </li>
          </ol>
          <Link
            href="/scraper"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong/90"
          >
            Buka Alat Scraper
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
