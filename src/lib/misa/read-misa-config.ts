import 'server-only';
import type { MisaEnvironment } from '@/types/misa';
import type { MisaConfigResult } from '@/types/misa-config';

const API_URLS: Record<MisaEnvironment, string> = {
  test: 'https://testapi.meinvoice.vn/api/integration',
  production: 'https://api.meinvoice.vn/api/integration',
};

const CREDENTIAL_VARIABLES = [
  'MISA_MEINVOICE_APP_ID',
  'MISA_MEINVOICE_TAX_CODE',
  'MISA_MEINVOICE_USERNAME',
  'MISA_MEINVOICE_PASSWORD',
] as const;

function readVariable(name: string): string {
  return process.env[name]?.trim() ?? '';
}

function readEnvironment(): MisaEnvironment | null {
  const value = readVariable('MISA_MEINVOICE_ENVIRONMENT') || 'test';
  switch (value) {
    case 'test':
    case 'production':
      return value;
    default:
      return null;
  }
}

/** Tài khoản MISA chỉ nằm trong biến môi trường của máy chủ, không bao giờ gửi xuống trình duyệt. */
export function readMisaConfig(): MisaConfigResult {
  const missing = CREDENTIAL_VARIABLES.filter((name) => !readVariable(name));
  if (missing.length > 0) {
    return {
      ok: false,
      error: `Chưa cấu hình tài khoản MISA: thiếu ${missing.join(', ')} trong .env.local của máy chủ.`,
    };
  }
  const environment = readEnvironment();
  if (!environment) {
    return {
      ok: false,
      error: 'MISA_MEINVOICE_ENVIRONMENT chỉ nhận "test" hoặc "production".',
    };
  }
  // Ghi đè địa chỉ API để chạy với máy chủ giả lập MISA khi kiểm thử.
  const apiUrl =
    readVariable('MISA_MEINVOICE_API_URL') || API_URLS[environment];
  return {
    ok: true,
    config: {
      environment,
      apiUrl: apiUrl.replace(/\/+$/, ''),
      appId: readVariable('MISA_MEINVOICE_APP_ID'),
      taxCode: readVariable('MISA_MEINVOICE_TAX_CODE'),
      username: readVariable('MISA_MEINVOICE_USERNAME'),
      password: process.env.MISA_MEINVOICE_PASSWORD ?? '',
    },
  };
}
