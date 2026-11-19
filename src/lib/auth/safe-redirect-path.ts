import { LOGIN_PATH } from './session-config';

const DEFAULT_REDIRECT_PATH = '/';

function isInternalPath(path: string): boolean {
  return (
    path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\')
  );
}

function isLoginPath(path: string): boolean {
  return path === LOGIN_PATH || path.startsWith(`${LOGIN_PATH}?`);
}

/** Chỉ nhận đường dẫn nội bộ để tham số `from` không bị lợi dụng chuyển hướng sang trang ngoài. */
export function getSafeRedirectPath(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !isInternalPath(value) ||
    isLoginPath(value)
  ) {
    return DEFAULT_REDIRECT_PATH;
  }
  return value;
}
