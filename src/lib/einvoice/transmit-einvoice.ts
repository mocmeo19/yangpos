import { getErrorMessage } from '@/lib/get-error-message';
import type { EInvoice } from '@/types/einvoice';
import type {
  EInvoiceProvider,
  EInvoiceTransmitChanges,
} from '@/types/einvoice-provider';

/**
 * Không ném lỗi: kết quả gửi, kể cả thất bại, được ghi lên hóa đơn để thu ngân gửi lại sau. Nhà
 * cung cấp cấp số lúc phát hành thì số, mã và mã tra cứu đi kèm kết quả.
 */
export async function transmitEInvoice(
  provider: EInvoiceProvider,
  invoice: EInvoice,
): Promise<EInvoiceTransmitChanges> {
  try {
    const result = await provider.transmit(invoice);
    const transmission = {
      status: result.status,
      attemptedAt: Date.now(),
      message: result.message,
    };
    return result.assignment
      ? { transmission, ...result.assignment }
      : { transmission };
  } catch (error) {
    return {
      transmission: {
        status: 'failed',
        attemptedAt: Date.now(),
        message: getErrorMessage(error),
      },
    };
  }
}
