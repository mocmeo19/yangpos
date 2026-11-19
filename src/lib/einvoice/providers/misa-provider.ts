import { publishMisaInvoice } from '@/actions/misa-einvoice-actions';
import { buildMisaInvoiceData } from '@/lib/misa/build-misa-invoice-data';
import type { EInvoiceProvider } from '@/types/einvoice-provider';

const TEST_ENVIRONMENT_MESSAGE =
  'Phát hành trên môi trường thử nghiệm của MISA (testapi.meinvoice.vn): chưa gửi cơ quan thuế, không có giá trị pháp lý.';

/**
 * Phát hành qua API tích hợp của MISA meInvoice (hóa đơn máy tính tiền, không ký số). MISA cấp số,
 * mã của cơ quan thuế và mã tra cứu; tài khoản tích hợp nằm trên máy chủ nên gọi qua Server Action.
 */
export const MISA_PROVIDER: EInvoiceProvider = {
  id: 'misa',
  label: 'MISA meInvoice',
  isSandbox: false,
  numbering: 'provider',
  lookupUrl: 'https://meinvoice.vn/tra-cuu',
  transmit: async (invoice) => {
    const result = await publishMisaInvoice(buildMisaInvoiceData(invoice));
    if (!result.ok) {
      throw new Error(result.error);
    }
    const isTest = result.environment === 'test';
    return {
      status: isTest ? 'sandbox' : 'sent',
      message: isTest ? TEST_ENVIRONMENT_MESSAGE : null,
      assignment: {
        series: result.invoice.series ?? invoice.series,
        number: result.invoice.number,
        taxAuthorityCode: result.invoice.taxAuthorityCode,
        lookupCode: result.invoice.lookupCode,
        isSandbox: isTest,
      },
    };
  },
};
