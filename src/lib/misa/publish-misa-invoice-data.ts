import 'server-only';
import type { MisaPublishedInvoice } from '@/types/misa';
import type { MisaConfig } from '@/types/misa-config';
import type { MisaInvoiceData } from '@/types/misa-invoice-data';
import { callMisaApi } from './call-misa-api';
import { createMisaEnvelopeError } from './create-misa-envelope-error';
import { readMisaPublishedInvoice } from './read-misa-published-invoice';

// Kiểu ký số 5 của MISA: hóa đơn khởi tạo từ máy tính tiền, phát hành không cần chữ ký số.
const CASH_REGISTER_SIGN_TYPE = 5;

/** Phát hành một hóa đơn máy tính tiền lên MISA và nhận số, mã MISA cấp. */
export async function publishMisaInvoiceData(
  config: MisaConfig,
  invoice: MisaInvoiceData,
): Promise<MisaPublishedInvoice> {
  const envelope = await callMisaApi(config, {
    method: 'POST',
    path: '',
    body: {
      SignType: CASH_REGISTER_SIGN_TYPE,
      InvoiceData: [invoice],
      PublishInvoiceData: null,
    },
  });
  if (!envelope.success) {
    throw createMisaEnvelopeError(envelope);
  }
  return readMisaPublishedInvoice(
    envelope.publishInvoiceResult ?? envelope.data,
    invoice.RefID,
  );
}
