import 'server-only';
import { createHmac } from 'node:crypto';
import { safeEqual } from '@/lib/auth/safe-equal';

interface StaffSessionPayload {
  employeeId: string;
  expiresAt: number;
}

// Khác tiền tố với phiên đăng nhập cửa hàng để token loại này không dùng thay được cho loại kia.
const TOKEN_PURPOSE = 'staff:';

function sign(encodedPayload: string, secret: string): string {
  return createHmac('sha256', secret)
    .update(TOKEN_PURPOSE + encodedPayload)
    .digest('base64url');
}

function isStaffSessionPayload(value: unknown): value is StaffSessionPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.employeeId === 'string' &&
    typeof candidate.expiresAt === 'number'
  );
}

function decodePayload(encodedPayload: string): unknown {
  try {
    return JSON.parse(Buffer.from(encodedPayload, 'base64url').toString());
  } catch {
    return null;
  }
}

export function createStaffSessionToken(
  payload: StaffSessionPayload,
  secret: string,
): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    'base64url',
  );
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

/** Trả về mã nhân viên khi token đúng chữ ký và chưa hết hạn; ngược lại trả về `null`. */
export function verifyStaffSessionToken(
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
  if (!isStaffSessionPayload(payload) || payload.expiresAt <= now) {
    return null;
  }
  return payload.employeeId;
}
