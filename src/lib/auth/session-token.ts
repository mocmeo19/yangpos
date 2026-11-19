import { createHmac } from 'node:crypto';
import { safeEqual } from './safe-equal';

interface SessionPayload {
  username: string;
  expiresAt: number;
}

function isSessionPayload(value: unknown): value is SessionPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.username === 'string' &&
    typeof candidate.expiresAt === 'number'
  );
}

function sign(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(encodedPayload)
    .digest('base64url');
}

function decodePayload(encodedPayload: string): unknown {
  try {
    return JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
  } catch {
    return null;
  }
}

export function createSessionToken(
  username: string,
  expiresAt: number,
  secret: string,
): string {
  const payload: SessionPayload = { username, expiresAt };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  );
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

/** Trả về tên đăng nhập khi token đúng chữ ký và chưa hết hạn; ngược lại trả về `null`. */
export function verifySessionToken(
  token: string,
  secret: string,
  now: number = Date.now(),
): string | null {
  const [encodedPayload, signature, ...rest] = token.split('.');
  if (!encodedPayload || !signature || rest.length > 0) {
    return null;
  }
  if (!safeEqual(signature, sign(encodedPayload, secret))) {
    return null;
  }

  const payload = decodePayload(encodedPayload);
  if (!isSessionPayload(payload) || payload.expiresAt <= now) {
    return null;
  }
  return payload.username;
}
