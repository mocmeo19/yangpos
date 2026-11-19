'use server';

import { redirect } from 'next/navigation';
import { verifyDemoCredentials } from '@/lib/auth/demo-account';
import { getSafeRedirectPath } from '@/lib/auth/safe-redirect-path';
import { createSession, deleteSession } from '@/lib/auth/session';
import { LOGIN_PATH } from '@/lib/auth/session-config';
import type { LoginFormState } from '@/types/auth';

function readText(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

export async function login(
  _previousState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const username = readText(formData, 'username').trim();
  const password = readText(formData, 'password');

  if (!username || !password) {
    return { error: 'Vui lòng nhập tên đăng nhập và mật khẩu.', username };
  }
  if (!verifyDemoCredentials(username, password)) {
    return { error: 'Tên đăng nhập hoặc mật khẩu không đúng.', username };
  }

  await createSession(username);
  redirect(getSafeRedirectPath(formData.get('redirectTo')));
}

export async function logout(): Promise<void> {
  await deleteSession();
  redirect(LOGIN_PATH);
}
