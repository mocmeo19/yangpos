import type { MisaEnvironment } from './misa';

/** Tài khoản tích hợp MISA meInvoice; chỉ đọc từ biến môi trường trên máy chủ. */
export interface MisaConfig {
  environment: MisaEnvironment;
  /** Gốc API tích hợp, vd "https://testapi.meinvoice.vn/api/integration". */
  apiUrl: string;
  appId: string;
  taxCode: string;
  username: string;
  password: string;
}

export type MisaConfigResult =
  { ok: true; config: MisaConfig } | { ok: false; error: string };
