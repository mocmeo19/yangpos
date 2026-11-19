import 'server-only';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { getSessionSecret, SESSION_COOKIE_NAME } from './session-config';
import { verifySessionToken } from './session-token';

export async function getCurrentUsername(): Promise<string | null> {
  // Phiên có hạn dùng nên phải kiểm tra theo thời điểm của request, không được prerender.
  await connection();
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }
  return verifySessionToken(token, getSessionSecret());
}
