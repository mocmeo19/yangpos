import { EINVOICE_TRANSMISSION_LABELS } from '@/data/einvoice-labels';
import { VAT_RATE_SHORT_LABELS } from '@/data/vat-rates';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatFullDateTime } from '@/lib/format-time';
import type { EInvoice, InvoiceBuyer } from '@/types/einvoice';
import type { SpreadsheetRow } from '@/types/spreadsheet';

interface LedgerTaxLine {
  rateLabel: string;
  amountBeforeTax: number;
  vatAmount: number;
}

const HEADER: SpreadsheetRow = [
  'STT',
  'Ký hiệu mẫu số',
  'Ký hiệu hóa đơn',
  'Số hóa đơn',
  'Ngày lập',
  'Mã của cơ quan thuế',
  'Mã tra cứu',
  'Người mua',
  'MST / số định danh người mua',
  'Thuế suất',
  'Tiền hàng chưa thuế',
  'Tiền thuế GTGT',
  'Tổng thanh toán',
  'Đơn hàng',
  'Trạng thái gửi',
];

function describeBuyerId(buyer: InvoiceBuyer | null): string {
  if (!buyer) {
    return '';
  }
  return buyer.kind === 'company' ? buyer.taxCode : buyer.personalId;
}

/** Hóa đơn bán hàng không tách thuế nên chỉ có một dòng tổng. */
function toLedgerTaxLines(invoice: EInvoice): LedgerTaxLine[] {
  if (invoice.taxLines.length === 0) {
    return [
      {
        rateLabel: '',
        amountBeforeTax: invoice.totalBeforeTax,
        vatAmount: 0,
      },
    ];
  }
  return invoice.taxLines.map((taxLine) => ({
    rateLabel: VAT_RATE_SHORT_LABELS[taxLine.vatRate],
    amountBeforeTax: taxLine.amountBeforeTax,
    vatAmount: taxLine.vatAmount,
  }));
}

/** Bảng kê hóa đơn bán ra: mỗi thuế suất của một hóa đơn là một dòng, giống cách lập tờ khai thuế. */
export function buildInvoiceLedgerRows(
  invoices: readonly EInvoice[],
): SpreadsheetRow[] {
  const rows: SpreadsheetRow[] = [HEADER];
  const sorted = [...invoices].sort(
    (first, second) => first.issuedAt - second.issuedAt,
  );
  for (const invoice of sorted) {
    for (const taxLine of toLedgerTaxLines(invoice)) {
      rows.push([
        rows.length,
        invoice.template,
        invoice.series,
        formatEInvoiceNumber(invoice.number),
        formatFullDateTime(invoice.issuedAt),
        invoice.taxAuthorityCode,
        invoice.lookupCode ?? '',
        invoice.buyer?.name ?? 'Khách lẻ',
        describeBuyerId(invoice.buyer),
        taxLine.rateLabel,
        taxLine.amountBeforeTax,
        taxLine.vatAmount,
        taxLine.amountBeforeTax + taxLine.vatAmount,
        formatOrderNumber(invoice.orderNumber),
        EINVOICE_TRANSMISSION_LABELS[invoice.transmission.status],
      ]);
    }
  }
  return rows;
}
