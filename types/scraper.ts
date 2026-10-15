/** Tipe data hasil scraper Alight Motion, mengikuti struktur asli sumber. */

export interface GuerrillaMail {
  /** Alamat email sementara dari Guerrilla Mail */
  email: string;
  /** Token sesi Guerrilla Mail */
  sid: string;
  /** Alias email (bisa kosong) */
  alias: string;
}

export interface InboxMessage {
  id: string;
  from: string;
  subject: string;
  date: string;
  excerpt: string;
  /** Link verifikasi Alight Motion bila ditemukan pada isi pesan */
  magicLink: string | null;
}

/** Respons mentah endpoint /api/send-link pada layanan hulu */
export type SendLinkResult = Record<string, unknown>;

/** Respons verifikasi akun; struktur mengikuti keluaran asli scraper */
export interface VerifyResult {
  orderId?: string | null;
  uid?: string | null;
  isNewUser?: boolean;
  [key: string]: unknown;
}

export interface GeneratedAccount {
  status: boolean;
  email: string;
  orderId: string | null;
  uid: string | null;
  isNewUser: boolean;
  magicLink: string;
}

export type BulkAccountResult = {
  index: number;
  error?: string;
} & Partial<GeneratedAccount>;

export interface BulkResult {
  status: boolean;
  total_requested: number;
  total_success: number;
  total_failed: number;
  accounts: BulkAccountResult[];
}

/** Format respons API standar aplikasi ini */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
