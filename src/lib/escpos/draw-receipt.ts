import { formatCurrency } from '@/lib/format-currency';
import { formatDateTime } from '@/lib/format-time';
import { formatPagerLabel } from '@/lib/pager/format-pager-label';
import { createQrMatrix } from '@/lib/qr/create-qr-matrix';
import { formatReceiptQuantity } from '@/lib/receipt/format-receipt-quantity';
import { getReceiptTotalLabel } from '@/lib/receipt/get-receipt-total-label';
import type {
  Receipt,
  ReceiptPaymentInfo,
  ReceiptTransferQr,
} from '@/types/receipt';
import type { ReceiptTextStyles } from '@/types/receipt-text-styles';
import {
  drawEInvoiceAmountInWords,
  drawEInvoiceFooter,
  drawEInvoiceHeading,
  drawEInvoiceSummaryRows,
} from './draw-einvoice-sections';
import type { ReceiptCanvasWriter, TextStyle } from './receipt-canvas-writer';

// Cỡ chữ tính theo khổ 80mm, được co lại theo tỷ lệ khi in khổ 58mm.
const FONT_SIZES = {
  storeName: 32,
  title: 28,
  total: 28,
  body: 24,
  small: 20,
} as const;
const QR_SIZE = 260;
const LINE_GAP = 6;

function createTextStyles(scale: number): ReceiptTextStyles {
  const scaled = (size: number) => Math.round(size * scale);
  const small: TextStyle = { size: scaled(FONT_SIZES.small) };
  return {
    storeName: {
      size: scaled(FONT_SIZES.storeName),
      weight: 700,
      align: 'center',
    },
    title: { size: scaled(FONT_SIZES.title), weight: 700, align: 'center' },
    total: { size: scaled(FONT_SIZES.total), weight: 700 },
    body: { size: scaled(FONT_SIZES.body) },
    small,
    centeredSmall: { ...small, align: 'center' },
    lineGap: scaled(LINE_GAP),
  };
}

function drawStoreHeader(
  writer: ReceiptCanvasWriter,
  receipt: Receipt,
  styles: ReceiptTextStyles,
): void {
  const { store } = receipt;
  writer.text(
    (store.name || 'Tên cửa hàng').toLocaleUpperCase('vi-VN'),
    styles.storeName,
  );
  // Hóa đơn điện tử đã ghi tên, MST, địa chỉ người bán theo đăng ký thuế nên không in lặp lại.
  if (receipt.eInvoice) {
    return;
  }
  if (store.address) {
    writer.text(store.address, styles.centeredSmall);
  }
  if (store.phone) {
    writer.text(`ĐT: ${store.phone}`, styles.centeredSmall);
  }
  if (store.taxCode) {
    writer.text(`MST: ${store.taxCode}`, styles.centeredSmall);
  }
}

function drawOrderHeading(
  writer: ReceiptCanvasWriter,
  receipt: Receipt,
  styles: ReceiptTextStyles,
): void {
  writer.text(receipt.title, styles.title);
  writer.columns(`Số: ${receipt.orderLabel}`, receipt.tableName, styles.small);
  writer.columns('Giờ vào', formatDateTime(receipt.createdAt), styles.small);
  writer.columns('In lúc', formatDateTime(receipt.printedAt), styles.small);
}

function drawPayment(
  writer: ReceiptCanvasWriter,
  payment: ReceiptPaymentInfo,
  small: TextStyle,
): void {
  writer.columns('Hình thức', payment.methodLabel, small);
  if (payment.cashReceived !== null) {
    writer.columns('Khách đưa', formatCurrency(payment.cashReceived), small);
  }
  if (payment.change !== null) {
    writer.columns('Tiền thừa', formatCurrency(payment.change), small);
  }
  if (payment.cardSummary) {
    writer.columns('Thẻ', payment.cardSummary, small);
  }
  if (payment.approvalCode) {
    writer.columns('Mã chuẩn chi', payment.approvalCode, small);
  }
  if (payment.transferNote) {
    writer.columns('Nội dung CK', payment.transferNote, small);
  }
}

function drawTransferQr(
  writer: ReceiptCanvasWriter,
  transferQr: ReceiptTransferQr,
  styles: ReceiptTextStyles,
  qrSize: number,
): void {
  const centered = styles.centeredSmall;
  writer.divider();
  writer.text('Quét mã để chuyển khoản', { ...centered, weight: 600 });
  writer.space(styles.lineGap);
  writer.qrCode(createQrMatrix(transferQr.payload), qrSize);
  writer.space(styles.lineGap);
  writer.text(`${transferQr.bankName} · ${transferQr.accountNumber}`, centered);
  if (transferQr.accountName) {
    writer.text(transferQr.accountName, centered);
  }
  writer.text(`Nội dung: ${transferQr.note}`, centered);
}

/** Bố cục hóa đơn cho máy in nhiệt, giữ cùng nội dung với bản in qua trình duyệt. */
export function drawReceipt(
  writer: ReceiptCanvasWriter,
  receipt: Receipt,
  scale: number,
): void {
  const styles = createTextStyles(scale);
  const { store, payment, transferQr, eInvoice } = receipt;

  drawStoreHeader(writer, receipt, styles);
  writer.divider();
  if (eInvoice) {
    drawEInvoiceHeading(writer, receipt, eInvoice, styles);
  } else {
    drawOrderHeading(writer, receipt, styles);
  }
  if (receipt.pagerNumber !== null) {
    writer.space(styles.lineGap);
    writer.text(
      formatPagerLabel(receipt.pagerNumber).toLocaleUpperCase('vi-VN'),
      styles.title,
    );
  }

  writer.divider();
  for (const line of receipt.lines) {
    writer.text(line.name, { ...styles.body, weight: 600 });
    if (line.note) {
      writer.text(`“${line.note}”`, { ...styles.small, italic: true });
    }
    writer.columns(
      formatReceiptQuantity(line),
      formatCurrency(line.amount),
      styles.body,
    );
    writer.space(styles.lineGap);
  }

  writer.divider();
  if (eInvoice) {
    drawEInvoiceSummaryRows(writer, eInvoice, styles);
  }
  writer.columns(
    getReceiptTotalLabel(receipt),
    formatCurrency(receipt.total),
    styles.total,
  );
  if (eInvoice) {
    drawEInvoiceAmountInWords(writer, eInvoice, styles);
  }
  if (payment) {
    drawPayment(writer, payment, styles.small);
  }
  if (transferQr) {
    drawTransferQr(writer, transferQr, styles, Math.round(QR_SIZE * scale));
  }
  if (eInvoice) {
    drawEInvoiceFooter(writer, eInvoice, styles);
  }
  if (store.wifiName) {
    writer.space(styles.lineGap);
    const password = store.wifiPassword
      ? ` · Mật khẩu: ${store.wifiPassword}`
      : '';
    writer.text(`Wi-Fi: ${store.wifiName}${password}`, styles.centeredSmall);
  }
  if (store.receiptFooter) {
    writer.divider();
    writer.text(store.receiptFooter, { ...styles.centeredSmall, italic: true });
  }
}
