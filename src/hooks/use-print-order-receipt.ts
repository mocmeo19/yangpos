'use client';

import { useCallback } from 'react';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { buildReceipt } from '@/lib/receipt/build-receipt';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import { findEInvoiceForOrder } from '@/api-client/einvoice-api';
import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';
import type { ReceiptKind } from '@/types/receipt';
import { usePrinter } from './use-printer';
import { useSettings } from './use-settings';
import { useTableNameResolver } from './use-table-name-resolver';
import { useToast } from './use-toast';

type OrderReceiptKind = Exclude<ReceiptKind, 'test'>;

const RECEIPT_NAMES: Record<OrderReceiptKind, string> = {
  final: 'hóa đơn',
  provisional: 'phiếu tạm tính',
};

interface PrintOrderReceiptOptions {
  openCashDrawer?: boolean;
  /** Hóa đơn điện tử vừa lập; bỏ trống thì tự tìm hóa đơn đã lập của đơn khi in lại. */
  eInvoice?: EInvoice | null;
}

/**
 * Chỉ hóa đơn thanh toán mới là bản thể hiện của hóa đơn điện tử, phiếu tạm tính thì không. Hóa
 * đơn còn chờ nhà cung cấp cấp số chưa có giá trị nên in như phiếu thanh toán thường.
 */
async function resolveEInvoice(
  order: Order,
  kind: OrderReceiptKind,
  eInvoice: EInvoice | null | undefined,
): Promise<EInvoice | null> {
  if (kind !== 'final') {
    return null;
  }
  const invoice =
    eInvoice === undefined ? await findEInvoiceForOrder(order.id) : eInvoice;
  return invoice && invoice.number !== null ? invoice : null;
}

/**
 * In phiếu của một đơn theo cài đặt máy in hiện tại. Lỗi máy in được báo bằng thông báo thay vì
 * ném ra để không làm gián đoạn thao tác bán hàng.
 */
export function usePrintOrderReceipt() {
  const { settings } = useSettings();
  const { printReceipt } = usePrinter();
  const showToast = useToast();
  const resolveTableName = useTableNameResolver();

  return useCallback(
    async (
      order: Order,
      kind: OrderReceiptKind,
      { openCashDrawer = false, eInvoice }: PrintOrderReceiptOptions = {},
    ): Promise<void> => {
      const receiptName = `${RECEIPT_NAMES[kind]} ${formatOrderNumber(order.number)}`;
      try {
        const receipt = buildReceipt({
          order,
          tableName: resolveTableName(order.tableId),
          settings,
          kind,
          printedAt: Date.now(),
          eInvoice: await resolveEInvoice(order, kind, eInvoice),
        });
        await printReceipt(receipt, { openCashDrawer });
        // In qua trình duyệt đã có hộp thoại in làm phản hồi, còn máy in mạng thì in lặng lẽ.
        if (settings.printer.mode === 'network') {
          showToast({ title: `Đã gửi ${receiptName} tới máy in` });
        }
      } catch (error) {
        showToast({
          tone: 'error',
          title: `Chưa in được ${receiptName}`,
          description: getErrorMessage(error),
          action: {
            label: 'Cài đặt máy in',
            href: getSettingsSectionHref('printer'),
          },
        });
      }
    },
    [printReceipt, resolveTableName, settings, showToast],
  );
}
