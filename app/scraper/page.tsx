import type { Metadata } from "next";
import ScraperTool from "@/components/scraper/ScraperTool";

export const metadata: Metadata = {
  title: "Alat Scraper",
  description:
    "Buat akun Alight Motion secara otomatis atau manual langkah demi langkah.",
};

export default function ScraperPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Alat Scraper
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Pilih mode otomatis untuk hasil sekali klik, atau mode manual untuk
          mengendalikan setiap langkah. Semua hasil berasal dari scraper
          sungguhan, tanpa data contoh.
        </p>
      </header>
      <ScraperTool />
    </div>
  );
}
