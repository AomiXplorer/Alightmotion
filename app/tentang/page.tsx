import type { Metadata } from "next";
import { MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang",
  description: "Informasi proyek, atribusi, dan kontak.",
};

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Tentang
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Latar belakang proyek, atribusi, dan cara menghubungi pembuat.
        </p>
      </header>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-semibold">Proyek ini</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Alight Motion Scraper menyediakan antarmuka web untuk alur
            pembuatan akun Alight Motion melalui email sementara: membuat email,
            mengirim link verifikasi, membaca kotak masuk, dan memverifikasi
            akun. Aplikasi dibangun dengan Next.js dan dirancang untuk
            penggunaan di ponsel Android maupun desktop.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Atribusi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Kode inti scraper diadaptasi dari{" "}
            <a
              className="underline hover:text-ink"
              href="https://github.com/KyuuX444/scraper/blob/main/tools/alightmotion.js"
              target="_blank"
              rel="noopener noreferrer"
            >
              KyuuX444/scraper — tools/alightmotion.js
            </a>
            . Repositori sumber tidak mencantumkan lisensi eksplisit. Perilaku
            inti scraper dipertahankan; penyesuaian hanya dilakukan untuk
            keamanan dan kompatibilitas Vercel.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Proyek ini bersifat independen dan tidak berafiliasi dengan Alight
            Motion. Pengguna bertanggung jawab mematuhi ketentuan layanan
            layanan pihak ketiga yang terlibat.
          </p>
        </section>

        <section className="rounded-lg border border-line bg-surface p-5">
          <h2 className="text-lg font-semibold">Dibuat oleh Aomi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Butuh bantuan, ada masukan, atau menemukan kendala pada aplikasi?
            Hubungi lewat WhatsApp berikut.
          </p>
          <a
            href="https://wa.me/6281249578370"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-4 text-sm font-medium text-white transition-colors hover:bg-accent-strong/90"
          >
            <MessageCircle size={16} aria-hidden="true" />
            WhatsApp: 081249578370
          </a>
        </section>
      </div>
    </div>
  );
}
