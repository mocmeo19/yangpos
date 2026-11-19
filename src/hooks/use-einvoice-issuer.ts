'use client';

import { useCallback, useMemo } from 'react';
import { describeEInvoice } from '@/lib/einvoice/describe-einvoice';
import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import { transmitEInvoice } from '@/lib/einvoice/transmit-einvoice';
import { getErrorMessage } from '@/lib/get-error-message';
import {
  issueEInvoiceForOrder,
  saveEInvoiceTransmitChanges,
} from '@/api-client/einvoice-api';
import type { EInvoice, InvoiceBuyer } from '@/types/einvoice';
import type { Order } from '@/types/order';
import { useToast } from './use-toast';

const INVOICE_LIST_HREF = '/finance#invoices';

export interface EInvoiceIssuer {
  /**
   * Lập hóa đơn rồi gửi nhà cung cấp; lỗi gửi được ghi lên hóa đơn chứ không ném ra. Nhà cung cấp
   * cấp số lúc phát hành thì chờ phát hành xong để bản in có số chính thức.
   */
  issueForOrder: (
    order: Order,
    buyer: InvoiceBuyer | null,
  ) => Promise<EInvoice>;
  /** Gửi (lại) qua đúng nhà cung cấp đã lập hóa đơn; trả về hóa đơn đã cập nhật kết quả gửi. */
  transmit: (invoice: EInvoice) => Promise<EInvoice>;
}

export function useEInvoiceIssuer(): EInvoiceIssuer {
  const showToast = useToast();

  const transmit = useCallback(
    async (invoice: EInvoice) => {
      // Theo nhà cung cấp ghi trên hóa đơn: hóa đơn thử nghiệm không bao giờ bị gửi thật dù Cài đặt đã đổi.
      const provider = getEInvoiceProvider(invoice.providerId);
      const changes = await transmitEInvoice(provider, invoice);
      const updated: EInvoice = { ...invoice, ...changes };
      const invoiceName = describeEInvoice(updated);
      try {
        await saveEInvoiceTransmitChanges(invoice.id, changes);
      } catch (error) {
        showToast({
          tone: 'error',
          title: `Chưa lưu được kết quả gửi ${invoiceName}`,
          description: getErrorMessage(error),
        });
        return updated;
      }
      if (changes.transmission.status === 'failed') {
        const failedAction =
          provider.numbering === 'provider' ? 'phát hành' : 'gửi';
        showToast({
          tone: 'error',
          title: `Chưa ${failedAction} được ${invoiceName}`,
          description: changes.transmission.message ?? undefined,
          action: { label: 'Xem hóa đơn', href: INVOICE_LIST_HREF },
        });
      }
      return updated;
    },
    [showToast],
  );

  const issueForOrder = useCallback(
    async (order: Order, buyer: InvoiceBuyer | null) => {
      const invoice = await issueEInvoiceForOrder(order.id, buyer);
      // Máy chủ chọn nhà cung cấp theo cài đặt đã lưu; đọc lại từ hóa đơn để gửi đúng nơi.
      const provider = getEInvoiceProvider(invoice.providerId);
      if (provider.numbering === 'provider') {
        return transmit(invoice);
      }
      void transmit(invoice);
      return invoice;
    },
    [transmit],
  );

  return useMemo(
    () => ({ issueForOrder, transmit }),
    [issueForOrder, transmit],
  );
}
