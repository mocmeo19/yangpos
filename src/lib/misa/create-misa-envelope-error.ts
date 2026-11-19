import type { MisaEnvelope } from '@/types/misa-envelope';
import { describeMisaError } from './describe-misa-error';
import { MisaApiError } from './misa-api-error';

/** Lỗi cho phản hồi MISA báo không thành công, kèm diễn giải dễ hiểu của mã lỗi. */
export function createMisaEnvelopeError(envelope: MisaEnvelope): MisaApiError {
  return new MisaApiError(
    envelope.errorCode,
    describeMisaError(envelope.errorCode, envelope.errorDescription),
  );
}
