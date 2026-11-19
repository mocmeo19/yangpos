export const SESSION_COOKIE_NAME = 'yangpos_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
export const LOGIN_PATH = '/login';

const MIN_SECRET_LENGTH = 32;

export function getSessionSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    throw new Error(
      `Thiếu biến môi trường AUTH_SECRET (tối thiểu ${MIN_SECRET_LENGTH} ký tự). Xem .env.example.`,
    );
  }
  return secret;
}
