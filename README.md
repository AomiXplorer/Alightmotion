# Alight Motion Scraper

Alat web untuk membuat akun Alight Motion melalui email sementara. Dibangun
dengan Next.js (App Router), TypeScript, dan Tailwind CSS. Dibuat oleh
**Aomi** — WhatsApp: [081249578370](https://wa.me/6281249578370).

Kode inti scraper diadaptasi dari
[KyuuX444/scraper — tools/alightmotion.js](https://github.com/KyuuX444/scraper/blob/main/tools/alightmotion.js)
(repositori tanpa lisensi eksplisit; gunakan dengan atribusi). Proyek ini
independen dan tidak berafiliasi dengan Alight Motion.

## Fitur

- **Mode otomatis** — sekali klik: email sementara dibuat, link verifikasi
  dikirim, kotak masuk dipantau, akun diverifikasi.
- **Mode manual** — kendali penuh per langkah: buat email, kirim link, cek
  kotak masuk, verifikasi manual.
- **Multi-akun (1–5)** — diproses berurutan dari sisi klien dengan progres
  yang jelas.
- **Status layanan** — indikator kesehatan hasil pemeriksaan nyata ke layanan
  hulu.
- UI minimalist dark, mobile-first, Bahasa Indonesia.

## Teknologi

- Next.js 15 (App Router + Route Handlers, Node.js runtime)
- React 19, TypeScript, Tailwind CSS 4, Lucide React
- Axios (satu-satunya dependensi runtime scraper)

## Menjalankan secara lokal

Persyaratan:

- Node.js 18.18 atau lebih baru (disarankan 20+).

Langkah:

```bash
# 1. Instal dependensi
npm install

# 2. Jalankan development server
npm run dev

# 3. Buka http://localhost:3000
```

Pemeriksaan sebelum deploy:

```bash
npm run typecheck   # pemeriksaan TypeScript
npm run lint        # pemeriksaan ESLint
npm run build       # build produksi
npm run start       # jalankan hasil build produksi
```

Menguji API (contoh):

```bash
curl -X POST http://localhost:3000/api/alightmotion/email \
  -H "Content-Type: application/json" -d '{}'

curl -X POST http://localhost:3000/api/alightmotion/generate \
  -H "Content-Type: application/json" -d '{}'
```

## Environment Variables

Tidak ada variabel lingkungan wajib — scraper berjalan tanpa kredensial.
`.env.example` disediakan sebagai placeholder bila kelak dibutuhkan layanan
tambahan (mis. Redis untuk rate limiting terpusat).

## Deployment ke Vercel

1. Masukkan proyek ke repository Git (GitHub/GitLab/Bitbucket).
2. Buka [vercel.com](https://vercel.com) → **Add New Project** → impor
   repository proyek.
3. Vercel otomatis mendeteksi Next.js (build command `next build`).
   Tidak perlu `vercel.json`.
4. Karena tidak ada variabel wajib, langsung klik **Deploy**.
5. Setelah selesai, periksa tab **Logs** bila ada masalah.
6. Uji endpoint setelah online:

```bash
curl https://domain-anda.vercel.app/api/health
curl -X POST https://domain-anda.vercel.app/api/alightmotion/email \
  -H "Content-Type: application/json" -d '{}'
```

## Endpoint API

| Endpoint | Metode | Fungsi |
|---|---|---|
| `/api/health` | GET | Pemeriksaan kesehatan layanan (cek nyata ke hulu) |
| `/api/alightmotion/email` | POST | Buat email sementara Guerrilla Mail |
| `/api/alightmotion/send-link` | POST | Kirim link verifikasi (`{ email }`) |
| `/api/alightmotion/inbox` | POST | Baca kotak masuk, maks. 5 pesan (`{ email }`) |
| `/api/alightmotion/verify` | POST | Verifikasi akun (`{ email, link }`) |
| `/api/alightmotion/generate` | POST | Buat 1 akun penuh otomatis |

Format respons konsisten:

```json
{ "success": true,  "data": {}, "message": "Permintaan berhasil diproses" }
{ "success": false, "data": null, "message": "Permintaan gagal diproses" }
```

Dokumentasi lengkap tersedia di halaman `/dokumentasi` aplikasi.

## Batasan dan Catatan Teknis

- **Runtime**: semua endpoint memakai Node.js runtime (bukan Edge), karena
  scraper membutuhkan `axios`/modul Node.
- **Durasi**: `generate` mem-polling kotak masuk maks. ±45 detik dan
  menggunakan `maxDuration = 60` (batas Hobby). Pada pengujian nyata,
  satu akun selesai dalam ±12 detik.
- **Multi-akun**: lima akun penuh otomatis tidak muat dalam satu eksekusi
  function, sehingga diproses berurutan dari sisi klien (hasil akhirnya
  setara dengan fungsi `bulkGenerateAccounts` pada sumber).
- **Rate limiting**: best-effort per-instance di memori (serverless tidak
  menjamin keketatan lintas instance). Untuk batas ketat, gunakan
  penyimpanan bersama seperti Upstash Redis.
- **Penyimpanan**: tidak ada. Aplikasi tidak menyimpan data pengguna.
- **Keamanan**: validasi input, batas ukuran body (8 KB), timeout semua
  permintaan hulu, pesan error tanpa stack trace, dan protokol link
  dibatasi http/https.

## Status Pengujian

Sudah diuji dan berhasil (lokal, build produksi):

- Instalasi dependensi, `tsc --noEmit`, ESLint, dan `next build`.
- `GET /api/health` — cek nyata ke layanan hulu.
- `POST /api/alightmotion/email` — email Guerrilla nyata berhasil dibuat.
- `POST /api/alightmotion/send-link` — link verifikasi nyata terkirim.
- `POST /api/alightmotion/inbox` — pembacaan kotak masuk nyata.
- `POST /api/alightmotion/generate` — satu akun penuh berhasil dibuat dan
  diverifikasi end-to-end (±12 detik).
- Validasi input (email tidak valid, body bukan JSON, link tanpa http).
- Rate limiting (HTTP 429 terpicu pada batas).
- Semua halaman merespons HTTP 200; metode salah → HTTP 405.

Belum dapat diuji di lingkungan ini:

- Perilaku setelah benar-benar di-deploy ke Vercel (tidak ada akses akun
  Vercel; jalankan langkah deployment di atas).
- Pemeriksaan visual pada perangkat Android fisik (layout sudah dirancang
  mobile-first dengan target sentuh ≥44 px dan tanpa overflow horizontal).
- Clipboard API di browser: diimplementasikan dengan fallback, tetapi butuh
  interaksi browser nyata untuk verifikasi manual.
