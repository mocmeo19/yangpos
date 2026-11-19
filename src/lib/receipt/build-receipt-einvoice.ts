import {
  EINVOICE_ORIGIN_NOTE,
  EINVOICE_TEMPLATE_TITLES,
} from '@/data/einvoice-labels';
import { VAT_RATE_SHORT_LABELS } from '@/data/vat-rates';
import {
  describeBuyerLines,
  describeSellerLines,
} from '@/lib/einvoice/describe-invoice-parties';
import { formatEInvoiceNumber } from '@/lib/einvoice/format-einvoice-number';
import { formatCurrency } from '@/lib/format-currency';
import type { EInvoice, EInvoiceTaxLine } from '@/types/einvoice';
import type { ReceiptEInvoice, ReceiptEInvoiceRow } from '@/types/receipt';

function describeTaxLine(taxLine: EInvoiceTaxLine): ReceiptEInvoiceRow[] {
  const rate = VAT_RATE_SHORT_LABELS[taxLine.vatRate];
  return [
    {
      label: `Tiền hàng chưa thuế (${rate})`,
      value: formatCurrency(taxLine.amountBeforeTax),
    },
    {
      label: `Tiền thuế GTGT (${rate})`,
      value: formatCurrency(taxLine.vatAmount),
    },
  ];
}

/** Hóa đơn bán hàng không có dòng thuế; nhiều thuế suất thì ghi riêng từng thuế suất rồi cộng lại. */
function buildSummaryRows(invoice: EInvoice): ReceiptEInvoiceRow[] {
  const { taxLines } = invoice;
  if (taxLines.length === 0) {
    return [];
  }
  if (taxLines.length === 1) {
    const [taxLine] = taxLines;
    return [
      {
        label: 'Tiền hàng chưa thuế',
        value: formatCurrency(taxLine.amountBeforeTax),
      },
      {
        label: 'Thuế suất GTGT',
        value: VAT_RATE_SHORT_LABELS[taxLine.vatRate],
      },
      { label: 'Tiền thuế GTGT', value: formatCurrency(taxLine.vatAmount) },
    ];
  }
  return [
    ...taxLines.flatMap(describeTaxLine),
    { label: 'Cộng tiền thuế GTGT', value: formatCurrency(invoice.totalVat) },
  ];
}

function toLookupSite(lookupUrl: string): string {
  return lookupUrl.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}

/** Định dạng sẵn phần hóa đơn điện tử để bản in qua trình duyệt và máy in nhiệt giống hệt nhau. */
export function buildReceiptEInvoice(
  invoice: EInvoice,
  lookupUrl: string,
): ReceiptEInvoice {
  return {
    heading: EINVOICE_TEMPLATE_TITLES[invoice.template],
    originNote: EINVOICE_ORIGIN_NOTE,
    symbol: `${invoice.template}${invoice.series}`,
    number: formatEInvoiceNumber(invoice.number),
    issuedAt: invoice.issuedAt,
    sellerLines: describeSellerLines(invoice.seller),
    buyerLines: describeBuyerLines(invoice.buyer),
    summaryRows: buildSummaryRows(invoice),
    totalInWords: invoice.totalInWords,
    taxAuthorityCode: invoice.taxAuthorityCode,
    lookupCode: invoice.lookupCode,
    lookupSite: toLookupSite(lookupUrl),
    isSandbox: invoice.isSandbox,
  };
}
