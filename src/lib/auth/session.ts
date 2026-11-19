import 'server-only';
import { cookies } from 'next/headers';
import {
  getSessionSecret,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from './session-config';
import { createSessionToken } from './session-token';

export async function createSession(username: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  const token = createSessionToken(username, expiresAt, getSessionSecret());
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
