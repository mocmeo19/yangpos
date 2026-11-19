import { findVietnamBank } from '@/lib/find-vietnam-bank';
import { formatOrderNumber } from '@/lib/format-order-number';
import { isBankTransferReady } from '@/lib/is-bank-transfer-ready';
import { isOrderPaid } from '@/lib/is-order-paid';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import { buildTransferNote } from '@/lib/transfer-note';
import { buildVietQrPayload } from '@/lib/vietqr';
import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';
import type {
  Receipt,
  ReceiptKind,
  ReceiptLine,
  ReceiptTransferQr,
} from '@/types/receipt';
import type { AppSettings } from '@/types/settings';
import { buildPaymentInfo } from './build-payment-info';
import { buildReceiptEInvoice } from './build-receipt-einvoice';

const RECEIPT_TITLES: Record<ReceiptKind, string> = {
  final: 'HÓA ĐƠN THANH TOÁN',
  provisional: 'PHIẾU TẠM TÍNH',
  test: 'IN THỬ HÓA ĐƠN',
};

interface BuildReceiptInput {
  order: Order;
  tableName: string;
  settings: AppSettings;
  kind: ReceiptKind;
  printedAt: number;
  /** Hóa đơn điện tử đã lập cho đơn; có thì bản in là bản thể hiện của hóa đơn đó. */
  eInvoice?: EInvoice | null;
}

function buildTransferQr(
  order: Order,
  total: number,
  settings: AppSettings,
): ReceiptTransferQr | null {
  const { bankTransfer } = settings;
  if (!isBankTransferReady(bankTransfer) || !bankTransfer.showQrOnReceipt) {
    return null;
  }
  const note = buildTransferNote(bankTransfer.notePrefix, order.number);
  return {
    payload: buildVietQrPayload({
      bankBin: bankTransfer.bankBin,
      accountNumber: bankTransfer.accountNumber,
      amount: total,
      note,
    }),
    bankName:
      findVietnamBank(bankTransfer.bankBin)?.shortName ?? bankTransfer.bankBin,
    accountNumber: bankTransfer.accountNumber,
    accountName: bankTransfer.accountName,
    note,
  };
}

function toOrderLines(order: Order): ReceiptLine[] {
  return order.items.map((item) => ({
    name: item.name,
    note: item.note,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    amount: item.unitPrice * item.quantity,
  }));
}

/** Dòng hàng in đúng như trên hóa đơn điện tử: đã gộp món trùng và có đơn vị tính, không kèm ghi chú bếp. */
function toInvoiceLines(invoice: EInvoice): ReceiptLine[] {
  return invoice.lines.map((line) => ({
    name: line.name,
    note: '',
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    amount: line.amount,
    unit: line.unit,
  }));
}

/** Mã QR chuyển khoản chỉ in trên phiếu chưa thanh toán vì đơn đã thu tiền thì không cần chuyển thêm. */
export function buildReceipt({
  order,
  tableName,
  settings,
  kind,
  printedAt,
  eInvoice = null,
}: BuildReceiptInput): Receipt {
  const total = calculateItemsTotal(order.items);
  const isAwaitingPayment = !isOrderPaid(order);

  return {
    kind,
    title: RECEIPT_TITLES[kind],
    store: settings.store,
    orderLabel: formatOrderNumber(order.number),
    tableName,
    createdAt: order.createdAt,
    printedAt,
    lines: eInvoice ? toInvoiceLines(eInvoice) : toOrderLines(order),
    itemCount: countItems(order.items),
    total,
    payment: buildPaymentInfo(order),
    transferQr: isAwaitingPayment
      ? buildTransferQr(order, total, settings)
      : null,
    eInvoice: eInvoice
      ? buildReceiptEInvoice(eInvoice, settings.eInvoice.lookupUrl)
      : null,
    pagerNumber: order.pagerNumber ?? null,
  };
}
