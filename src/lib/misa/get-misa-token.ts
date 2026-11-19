import 'server-only';
import type { MisaConfig } from '@/types/misa-config';
import { createMisaEnvelopeError } from './create-misa-envelope-error';
import { requestMisa } from './request-misa';

interface CachedToken {
  key: string;
  token: string;
  expiresAt: number;
}

const DEFAULT_LIFETIME_MS = 6 * 60 * 60 * 1000;
const EXPIRY_MARGIN_MS = 5 * 60 * 1000;

// Dùng lại token giữa các lần gọi để không phải đăng nhập MISA cho từng hóa đơn.
let cachedToken: CachedToken | null = null;

function toCacheKey(config: MisaConfig): string {
  return [config.apiUrl, config.appId, config.taxCode, config.username].join(
    '|',
  );
}

/** Hạn dùng ghi trong trường exp của JWT; token không phải JWT thì trả `null`. */
function readJwtExpiry(token: string): number | null {
  const payload = token.split('.')[1];
  if (!payload) {
    return null;
  }
  try {
    const claims: unknown = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf8'),
    );
    const expiry =
      typeof claims === 'object' && claims !== null
        ? Reflect.get(claims, 'exp')
        : null;
    return typeof expiry === 'number' ? expiry * 1000 : null;
  } catch {
    return null;
  }
}

export function forgetMisaToken(): void {
  cachedToken = null;
}

/** Token của API tích hợp; lấy mới khi chưa có, sắp hết hạn hoặc tài khoản trong cấu hình đã đổi. */
export async function getMisaToken(config: MisaConfig): Promise<string> {
  const key = toCacheKey(config);
  const now = Date.now();
  if (cachedToken?.key === key && cachedToken.expiresAt > now) {
    return cachedToken.token;
  }
  const envelope = await requestMisa({
    method: 'POST',
    url: `${config.apiUrl}/auth/token`,
    body: {
      appid: config.appId,
      taxcode: config.taxCode,
      username: config.username,
      password: config.password,
    },
  });
  const token = typeof envelope.data === 'string' ? envelope.data.trim() : '';
  if (!envelope.success || !token) {
    throw createMisaEnvelopeError(envelope);
  }
  const expiresAt =
    (readJwtExpiry(token) ?? now + DEFAULT_LIFETIME_MS) - EXPIRY_MARGIN_MS;
  cachedToken = { key, token, expiresAt };
  return token;
}
