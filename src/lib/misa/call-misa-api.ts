import 'server-only';
import type { MisaConfig } from '@/types/misa-config';
import type { MisaEnvelope } from '@/types/misa-envelope';
import { forgetMisaToken, getMisaToken } from './get-misa-token';
import { MisaApiError } from './misa-api-error';
import { requestMisa } from './request-misa';

const TOKEN_ERROR_CODES = new Set(['TokenExpiredCode', 'InvalidTokenCode']);

interface MisaApiRequest {
  method: 'GET' | 'POST';
  /** Phần sau gốc API hóa đơn, vd "/templates?year=2026"; chuỗi rỗng là chính gốc đó. */
  path: string;
  body?: unknown;
}

function isTokenErrorCode(code: string | null): boolean {
  return code !== null && TOKEN_ERROR_CODES.has(code);
}

async function sendWithToken(
  config: MisaConfig,
  { method, path, body }: MisaApiRequest,
): Promise<MisaEnvelope> {
  const envelope = await requestMisa({
    method,
    url: `${config.apiUrl}/invoice${path}`,
    token: await getMisaToken(config),
    body,
  });
  if (!envelope.success && isTokenErrorCode(envelope.errorCode)) {
    throw new MisaApiError(envelope.errorCode, 'Token MISA đã hết hạn.');
  }
  return envelope;
}

/**
 * Gọi API hóa đơn của MISA. Token hết hạn nghĩa là MISA chưa xử lý yêu cầu, nên lấy token mới và
 * gọi lại đúng một lần là an toàn, kể cả với lệnh phát hành.
 */
export async function callMisaApi(
  config: MisaConfig,
  request: MisaApiRequest,
): Promise<MisaEnvelope> {
  try {
    return await sendWithToken(config, request);
  } catch (error) {
    if (!(error instanceof MisaApiError) || !isTokenErrorCode(error.code)) {
      throw error;
    }
    forgetMisaToken();
    return sendWithToken(config, request);
  }
}
