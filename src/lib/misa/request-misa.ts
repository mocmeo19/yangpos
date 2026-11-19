import 'server-only';
import type { MisaEnvelope } from '@/types/misa-envelope';
import { MisaApiError } from './misa-api-error';
import { readMisaEnvelope } from './read-misa-envelope';

const TIMEOUT_MS = 20_000;

interface MisaHttpRequest {
  method: 'GET' | 'POST';
  url: string;
  token?: string;
  body?: unknown;
}

interface MisaHttpResponse {
  status: number;
  text: string;
}

/** Lỗi fetch của Node chỉ ghi "fetch failed"; mã lỗi mạng thật (vd ECONNREFUSED) nằm trong `cause`. */
function readNetworkErrorCode(error: unknown): string | null {
  if (!(error instanceof Error) || typeof error.cause !== 'object') {
    return null;
  }
  const code = error.cause === null ? null : Reflect.get(error.cause, 'code');
  return typeof code === 'string' ? code : null;
}

function describeNetworkError(error: unknown): string {
  if (error instanceof Error && error.name === 'TimeoutError') {
    return `MISA không phản hồi sau ${TIMEOUT_MS / 1000} giây.`;
  }
  const code = readNetworkErrorCode(error);
  const detail = code ? ` (${code})` : '';
  return `Không kết nối được MISA${detail}. Kiểm tra Internet của máy chủ bán hàng rồi thử lại.`;
}

/** Đọc trọn phản hồi trong cùng thời hạn chờ, vì kết nối có thể đứt cả lúc đang nhận dữ liệu. */
async function fetchText({
  method,
  url,
  token,
  body,
}: MisaHttpRequest): Promise<MisaHttpResponse> {
  const headers = new Headers({ 'Content-Type': 'application/json' });
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return { status: response.status, text: await response.text() };
  } catch (error) {
    throw new MisaApiError(null, describeNetworkError(error));
  }
}

function parseBody({ status, text }: MisaHttpResponse): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new MisaApiError(
      null,
      `MISA trả về dữ liệu không đọc được (HTTP ${status}).`,
    );
  }
}

/** Gửi một yêu cầu tới MISA; lỗi mạng, quá giờ hay phản hồi lạ đều thành `MisaApiError` dễ hiểu. */
export async function requestMisa(
  request: MisaHttpRequest,
): Promise<MisaEnvelope> {
  const response = await fetchText(request);
  if (response.status === 401) {
    throw new MisaApiError(
      'InvalidTokenCode',
      'MISA từ chối phiên làm việc (HTTP 401).',
    );
  }
  return readMisaEnvelope(parseBody(response));
}
