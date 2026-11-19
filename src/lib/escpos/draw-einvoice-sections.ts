import { EINVOICE_SANDBOX_NOTICE } from '@/data/einvoice-labels';
import { formatFullDateTime } from '@/lib/format-time';
import type { Receipt, ReceiptEInvoice } from '@/types/receipt';
import type { ReceiptTextStyles } from '@/types/receipt-text-styles';
import type { ReceiptCanvasWriter } from './receipt-canvas-writer';

function drawLines(
  writer: ReceiptCanvasWriter,
  lines: readonly string[],
  styles: ReceiptTextStyles,
): void {
  writer.space(styles.lineGap);
  for (const line of lines) {
    writer.text(line, styles.small);
  }
}

/** Đầu bản thể hiện hóa đơn điện tử, cùng nội dung với bản in qua trình duyệt. */
export function drawEInvoiceHeading(
  writer: ReceiptCanvasWriter,
  receipt: Receipt,
  eInvoice: ReceiptEInvoice,
  styles: ReceiptTextStyles,
): void {
  writer.text(eInvoice.heading, styles.title);
  writer.text(eInvoice.originNote, { ...styles.centeredSmall, italic: true });
  writer.space(styles.lineGap);
  writer.columns(
    `Ký hiệu: ${eInvoice.symbol}`,
    `Số: ${eInvoice.number}`,
    styles.small,
  );
  writer.columns(
    'Ngày lập',
    formatFullDateTime(eInvoice.issuedAt),
    styles.small,
  );
  drawLines(writer, eInvoice.sellerLines, styles);
  drawLines(writer, eInvoice.buyerLines, styles);
  writer.space(styles.lineGap);
  writer.columns(`Đơn ${receipt.orderLabel}`, receipt.tableName, styles.small);
}

export function drawEInvoiceSummaryRows(
  writer: ReceiptCanvasWriter,
  eInvoice: ReceiptEInvoice,
  styles: ReceiptTextStyles,
): void {
  for (const row of eInvoice.summaryRows) {
    writer.columns(row.label, row.value, styles.small);
  }
}

export function drawEInvoiceAmountInWords(
  writer: ReceiptCanvasWriter,
  eInvoice: ReceiptEInvoice,
  styles: ReceiptTextStyles,
): void {
  writer.text(`Bằng chữ: ${eInvoice.totalInWords}.`, {
    ...styles.small,
    italic: true,
  });
}

export function drawEInvoiceFooter(
  writer: ReceiptCanvasWriter,
  eInvoice: ReceiptEInvoice,
  styles: ReceiptTextStyles,
): void {
  writer.divider();
  if (eInvoice.taxAuthorityCode) {
    writer.text('Mã của cơ quan thuế:', styles.centeredSmall);
    writer.text(eInvoice.taxAuthorityCode, {
      ...styles.body,
      weight: 700,
      align: 'center',
    });
  }
  if (eInvoice.lookupCode) {
    writer.text(`Mã tra cứu: ${eInvoice.lookupCode}`, {
      ...styles.centeredSmall,
      weight: 700,
    });
  }
  writer.text(
    `Tra cứu hóa đơn tại: ${eInvoice.lookupSite}`,
    styles.centeredSmall,
  );
  if (eInvoice.isSandbox) {
    writer.space(styles.lineGap);
    writer.text(EINVOICE_SANDBOX_NOTICE, {
      ...styles.centeredSmall,
      weight: 700,
    });
  }
}
