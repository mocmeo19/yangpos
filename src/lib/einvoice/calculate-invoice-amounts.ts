import { VAT_RATE_CODES, VAT_RATE_PERCENT } from '@/data/vat-rates';
import type {
  EInvoiceLine,
  EInvoiceTaxLine,
  EInvoiceTemplate,
  InvoiceAmounts,
  PricedInvoiceLine,
  VatRateCode,
} from '@/types/einvoice';

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function splitBeforeTax(amount: number, vatRate: VatRateCode): number {
  return Math.round((amount * 100) / (100 + VAT_RATE_PERCENT[vatRate]));
}

/** Hóa đơn bán hàng không tách thuế: tiền hàng chính là số tiền thanh toán. */
function calculateSalesInvoice(
  lines: readonly PricedInvoiceLine[],
): InvoiceAmounts {
  const invoiceLines = lines.map((line) => {
    const amount = line.unitPrice * line.quantity;
    return { ...line, amount, vatRate: null, amountBeforeTax: amount };
  });
  const totalAmount = sum(invoiceLines.map((line) => line.amount));
  return {
    lines: invoiceLines,
    taxLines: [],
    totalBeforeTax: totalAmount,
    totalVat: 0,
    totalAmount,
  };
}

/**
 * Giá trên thực đơn đã gồm thuế GTGT: tách tiền thuế trên tổng tiền của từng thuế suất, rồi chia
 * phần chưa thuế cho các dòng; dòng cuối nhận phần chênh do làm tròn để tổng luôn khớp.
 */
export function calculateInvoiceAmounts(
  lines: readonly PricedInvoiceLine[],
  template: EInvoiceTemplate,
): InvoiceAmounts {
  if (template === '2') {
    return calculateSalesInvoice(lines);
  }
  const invoiceLines: EInvoiceLine[] = lines.map((line) => ({
    ...line,
    amount: line.unitPrice * line.quantity,
    amountBeforeTax: 0,
  }));
  const taxLines: EInvoiceTaxLine[] = [];

  for (const vatRate of VAT_RATE_CODES) {
    const indexes = invoiceLines.flatMap((line, index) =>
      line.vatRate === vatRate ? [index] : [],
    );
    if (indexes.length === 0) {
      continue;
    }
    const groupAmount = sum(indexes.map((index) => invoiceLines[index].amount));
    const groupBeforeTax = splitBeforeTax(groupAmount, vatRate);
    let allocated = 0;
    indexes.forEach((lineIndex, position) => {
      const line = invoiceLines[lineIndex];
      const isLastLine = position === indexes.length - 1;
      const amountBeforeTax = isLastLine
        ? groupBeforeTax - allocated
        : splitBeforeTax(line.amount, vatRate);
      allocated += amountBeforeTax;
      invoiceLines[lineIndex] = { ...line, amountBeforeTax };
    });
    taxLines.push({
      vatRate,
      amountBeforeTax: groupBeforeTax,
      vatAmount: groupAmount - groupBeforeTax,
    });
  }

  const totalBeforeTax = sum(taxLines.map((line) => line.amountBeforeTax));
  const totalVat = sum(taxLines.map((line) => line.vatAmount));
  return {
    lines: invoiceLines,
    taxLines,
    totalBeforeTax,
    totalVat,
    totalAmount: totalBeforeTax + totalVat,
  };
}
