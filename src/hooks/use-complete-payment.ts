'use client';

import { useCallback } from 'react';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { shouldIssueEInvoice } from '@/lib/einvoice/should-issue-einvoice';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { calculateItemsTotal } from '@/lib/order-totals';
import { planAfterPayment } from '@/lib/payment/plan-after-payment';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import { payOrder } from '@/api-client/order-api';
import type { CheckoutInput } from '@/types/checkout';
import type { EInvoice, InvoiceBuyer } from '@/types/einvoice';
import type { Order, PaymentInput, PaymentMethod } from '@/types/order';
import { useEInvoiceIssuer } from './use-einvoice-issuer';
import { usePrintOrderReceipt } from './use-print-order-receipt';
import { usePrinter } from './use-printer';
import { useSettings } from './use-settings';
import { useTableNameResolver } from './use-table-name-resolver';
import { useToast } from './use-toast';

interface IssueOutcome {
  invoice: EInvoice | null;
  error: string | null;
}

const NOT_ISSUED: IssueOutcome = { invoice: null, error: null };

function describePayment(
  order: Order,
  payment: PaymentInput,
  tableName: string,
  invoice: EInvoice | null,
): string {
  const parts = [tableName];
  const cashReceived = payment.details.cashReceived ?? 0;
  const change = cashReceived - calculateItemsTotal(order.items);
  if (change > 0) {
    parts.push(`Trả lại khách ${formatCurrency(change)}`);
  }
  if (invoice && invoice.number !== null) {
    parts.push(`Hóa đơn số ${formatEInvoiceNumber(invoice.number)}`);
  }
  return parts.join(' · ');
}

/**
 * Ghi nhận thanh toán, lập hóa đơn điện tử rồi mới in và mở két. Tiền đã thu nên lỗi lập hóa đơn
 * hay lỗi thiết bị không được làm hỏng giao dịch, chỉ được báo để thu ngân xử lý tiếp.
 */
export function useCompletePayment() {
  const { settings } = useSettings();
  const { openCashDrawer } = usePrinter();
  const printOrderReceipt = usePrintOrderReceipt();
  const { issueForOrder } = useEInvoiceIssuer();
  const resolveTableName = useTableNameResolver();
  const showToast = useToast();

  const issueEInvoice = useCallback(
    async (
      paidOrder: Order,
      buyer: InvoiceBuyer | null,
    ): Promise<IssueOutcome> => {
      if (!shouldIssueEInvoice(settings.eInvoice, buyer)) {
        return NOT_ISSUED;
      }
      try {
        return { invoice: await issueForOrder(paidOrder, buyer), error: null };
      } catch (error) {
        return { invoice: null, error: getErrorMessage(error) };
      }
    },
    [issueForOrder, settings.eInvoice],
  );

  const runPaymentDevices = useCallback(
    async (
      paidOrder: Order,
      method: PaymentMethod,
      eInvoice: EInvoice | null,
    ) => {
      const plan = planAfterPayment(settings, method);
      if (plan.printReceipt) {
        // Gộp lệnh mở két vào lệnh in để két bật ra cùng lúc với hóa đơn.
        await printOrderReceipt(paidOrder, 'final', {
          openCashDrawer: plan.openCashDrawer,
          eInvoice,
        });
        return;
      }
      if (!plan.openCashDrawer) {
        return;
      }
      try {
        await openCashDrawer();
      } catch (error) {
        showToast({
          tone: 'error',
          title: 'Chưa mở được két tiền',
          description: getErrorMessage(error),
          action: {
            label: 'Cài đặt két tiền',
            href: getSettingsSectionHref('cashDrawer'),
          },
        });
      }
    },
    [openCashDrawer, printOrderReceipt, settings, showToast],
  );

  return useCallback(
    async (
      order: Order,
      { payment, invoiceBuyer }: CheckoutInput,
    ): Promise<Order> => {
      const paidOrder = await payOrder(order.id, payment);
      const issued = await issueEInvoice(paidOrder, invoiceBuyer);
      showToast({
        title: `Đã thanh toán đơn ${formatOrderNumber(order.number)}`,
        description: describePayment(
          order,
          payment,
          resolveTableName(order.tableId),
          issued.invoice,
        ),
      });
      if (issued.error) {
        showToast({
          tone: 'error',
          title: 'Chưa lập được hóa đơn điện tử',
          description: issued.error,
          action: { label: 'Lập lại', href: '/finance#invoices' },
        });
      }
      void runPaymentDevices(paidOrder, payment.method, issued.invoice);
      return paidOrder;
    },
    [issueEInvoice, resolveTableName, runPaymentDevices, showToast],
  );
}
