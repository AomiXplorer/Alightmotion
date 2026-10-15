import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumentasi",
  description: "Dokumentasi API, parameter, contoh respons, dan batasan runtime.",
};

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-lg border border-line bg-surface p-3.5 font-mono text-xs leading-relaxed text-ink">
      {children}
    </pre>
  );
}

export default function DokumentasiPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Dokumentasi
        </h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Panduan penggunaan aplikasi dan referensi API. Seluruh dokumentasi di
          bawah sesuai dengan implementasi aktual.
        </p>
      </header>

      <div className="space-y-4">
        <section>
          <h2 className="mt-8 text-lg font-semibold">Tentang aplikasi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Alight Motion Scraper adalah alat web untuk membuat akun Alight
            Motion melalui email sementara. Aplikasi mengadaptasi perilaku
            inti scraper sumber dan menyajikannya lewat antarmuka yang ramah
            ponsel.
          </p>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Fitur yang tersedia</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
            <li>Pembuatan email sementara (Guerrilla Mail).</li>
            <li>Pengiriman link verifikasi ke email.</li>
            <li>Pembacaan kotak masuk (maks. 5 pesan terbaru) dan deteksi link verifikasi.</li>
            <li>Verifikasi akun menggunakan link verifikasi.</li>
            <li>Mode otomatis: satu akun penuh otomatis per permintaan.</li>
            <li>Multi-akun (1–5): diproses berurutan dari sisi klien.</li>
          </ul>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Endpoint API</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Semua endpoint scraper menerima <code className="font-mono text-xs text-ink">POST</code> dengan
            body JSON dan menjawab format konsisten berikut:
          </p>
          <Code>{`// Sukses (HTTP 200)
{ "success": true, "data": {}, "message": "Permintaan berhasil diproses" }

// Gagal
{ "success": false, "data": null, "message": "Permintaan gagal diproses" }`}</Code>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">GET /api/health</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Pemeriksaan kesehatan layanan. Menghubungi layanan hulu secara
            nyata; hasilnya <em>tersedia</em>, <em>gangguan</em>, atau
            <em> tidak diketahui</em> beserta latensi.
          </p>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">POST /api/alightmotion/email</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Membuat email sementara. Tanpa parameter.
          </p>
          <Code>{`{}
// → data: { "email": "a1b2c3@guerrillamailblock.com", "sid": "…", "alias": "" }`}</Code>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">POST /api/alightmotion/send-link</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Mengirim link verifikasi Alight Motion ke alamat email target.
          </p>
          <Code>{`{ "email": "a1b2c3@guerrillamailblock.com" }
// → data: respons asli layanan hulu`}</Code>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">POST /api/alightmotion/inbox</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Membaca kotak masuk Guerrilla (maks. 5 pesan terbaru). Menerima
            alamat email lengkap atau nama pengguna saja.
          </p>
          <Code>{`{ "email": "a1b2c3@guerrillamailblock.com" }
// → data: { "messages": [ { "id": "…", "from": "…", "subject": "…", "date": "…", "excerpt": "…", "magicLink": "https://…" } ] }`}</Code>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">POST /api/alightmotion/verify</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Memverifikasi akun dengan link verifikasi. Link harus berupa URL
            http/https yang valid.
          </p>
          <Code>{`{ "email": "a1b2c3@guerrillamailblock.com", "link": "https://…" }
// → data: { "orderId": "…", "uid": "…", "isNewUser": true }`}</Code>
        </section>

        <section>
          <h3 className="mt-6 text-base font-semibold">POST /api/alightmotion/generate</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Mode otomatis: membuat email, mengirim link, menunggu email masuk
            (maks. ±45 detik), lalu memverifikasi — semuanya dalam satu
            permintaan. Endpoint ini berjalan pada Node.js runtime dengan
            durasi maksimum 60 detik.
          </p>
          <Code>{`{}
// → data: { "status": true, "email": "…", "orderId": "…", "uid": "…", "isNewUser": true, "magicLink": "https://…" }`}</Code>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Contoh pemakaian (curl)</h2>
          <Code>{`curl -X POST https://domain-anda.vercel.app/api/alightmotion/generate \\
  -H "Content-Type: application/json" -d '{}'`}</Code>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Kode status HTTP</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
            <li><span className="text-ink">200</span> — permintaan berhasil diproses.</li>
            <li><span className="text-ink">400</span> — input tidak valid atau body bukan JSON.</li>
            <li><span className="text-ink">429</span> — terlalu banyak permintaan dalam waktu singkat.</li>
            <li><span className="text-ink">502</span> — layanan hulu gagal atau tidak merespons.</li>
            <li><span className="text-ink">500</span> — kesalahan internal tak terduga.</li>
          </ul>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Penanganan error</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Pesan kesalahan ditampilkan dalam Bahasa Indonesia tanpa stack trace
            atau detail internal. Kegagalan layanan hulu (timeout, respons tidak
            valid) dipetakan ke status 502 dengan pesan yang aman.
          </p>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Batasan runtime Vercel</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted">
            <li>Semua endpoint berjalan pada Node.js runtime (bukan Edge).</li>
            <li>
              Endpoint <code className="font-mono text-xs text-ink">generate</code> memakai
              durasi maksimum 60 detik; menunggu email dibatasi ±45 detik.
            </li>
            <li>
              Multi-akun diproses berurutan dari sisi klien karena lima akun
              penuh otomatis tidak muat dalam satu eksekusi function.
            </li>
            <li>
              Rate limiting bersifat best-effort per-instance serverless; tidak
              menjamin batas ketat lintas instance. Untuk batas ketat, gunakan
              penyimpanan bersama seperti Redis.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Konfigurasi</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Aplikasi tidak membutuhkan environment variables; scraper berjalan
            tanpa kredensial. File <code className="font-mono text-xs text-ink">.env.example</code>{" "}
            disediakan sebagai placeholder bila kelak dibutuhkan layanan
            tambahan.
          </p>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Lisensi dan atribusi</h2>
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
            . Repositori tersebut tidak mencantumkan lisensi eksplisit; gunakan
            dengan atribusi dan hormati ketentuan layanan pihak terkait.
          </p>
        </section>

        <section>
          <h2 className="mt-8 text-lg font-semibold">Kontak</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Ada pertanyaan atau kendala? Hubungi Aomi melalui WhatsApp{" "}
            <a
              className="underline hover:text-ink"
              href="https://wa.me/6281249578370"
              target="_blank"
              rel="noopener noreferrer"
            >
              081249578370
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
