import 'server-only';
import { cookies } from 'next/headers';
import { getSessionSecret } from '@/lib/auth/session-config';
import {
  createStaffSessionToken,
  verifyStaffSessionToken,
} from './staff-session-token';

const STAFF_COOKIE_NAME = 'yangpos_staff';
// Dài hơn một ca làm việc; cookie không đặt maxAge nên đóng trình duyệt là máy khóa lại.
const STAFF_SESSION_MS = 14 * 60 * 60 * 1000;

export async function writeStaffSessionCookie(
  employeeId: string,
): Promise<void> {
  const token = createStaffSessionToken(
    { employeeId, expiresAt: Date.now() + STAFF_SESSION_MS },
    getSessionSecret(),
  );
  const cookieStore = await cookies();
  cookieStore.set(STAFF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export async function clearStaffSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(STAFF_COOKIE_NAME);
}

export async function readStaffSessionEmployeeId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(STAFF_COOKIE_NAME)?.value;
  return token ? verifyStaffSessionToken(token, getSessionSecret()) : null;
}
