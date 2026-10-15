import Link from "next/link";
import { MessageCircle } from "lucide-react";

const WA_URL = "https://wa.me/6281249578370";
const SOURCE_URL =
  "https://github.com/KyuuX444/scraper/blob/main/tools/alightmotion.js";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 text-sm font-semibold">
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md bg-accent font-mono text-[10px] font-bold text-white"
                aria-hidden="true"
              >
                AM
              </span>
              Alight Motion Scraper
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Alat web untuk membuat dan memverifikasi akun Alight Motion
              melalui email sementara. Dibuat oleh{" "}
              <span className="text-ink">Aomi</span>.
            </p>
          </div>

          <nav aria-label="Tautan footer">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-1">
              <li>
                <Link
                  href="/dokumentasi"
                  className="text-muted hover:text-ink"
                >
                  Dokumentasi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="text-muted hover:text-ink">
                  Tentang
                </Link>
              </li>
              <li>
                <a
                  href={SOURCE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-ink"
                >
                  Kode sumber scraper
                </a>
              </li>
              <li>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted hover:text-ink"
                >
                  <MessageCircle size={14} aria-hidden="true" />
                  WhatsApp: 081249578370
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-xs leading-relaxed text-muted">
          <p>
            Proyek independen, tidak berafiliasi dengan Alight Motion. Kode
            inti scraper diadaptasi dari{" "}
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-ink"
            >
              KyuuX444/scraper
            </a>{" "}
            (repositori tanpa lisensi eksplisit; gunakan dengan atribusi).
          </p>
          <p className="mt-1">
            © {new Date().getFullYear()} Alight Motion Scraper · dibuat oleh
            Aomi.
          </p>
        </div>
      </div>
    </footer>
  );
}
