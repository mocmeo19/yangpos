import 'server-only';
import type { MisaSeries } from '@/types/misa';
import type { MisaConfig } from '@/types/misa-config';
import { callMisaApi } from './call-misa-api';
import { createMisaEnvelopeError } from './create-misa-envelope-error';
import { forgetMisaToken } from './get-misa-token';
import { readMisaSeries } from './read-misa-series';

/**
 * Ký hiệu hóa đơn máy tính tiền đăng ký cho năm trên MISA. Bỏ token đang giữ để lần kiểm tra này
 * đăng nhập lại thật, xác nhận đúng tài khoản đang cấu hình.
 */
export async function listMisaSeries(
  config: MisaConfig,
  year: number,
): Promise<MisaSeries[]> {
  forgetMisaToken();
  const query = new URLSearchParams({
    invoiceWithCode: 'true',
    ticket: 'false',
    year: String(year),
  });
  const envelope = await callMisaApi(config, {
    method: 'GET',
    path: `/templates?${query}`,
  });
  if (!envelope.success) {
    throw createMisaEnvelopeError(envelope);
  }
  return readMisaSeries(envelope.data);
}
