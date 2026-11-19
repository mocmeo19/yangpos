import type { EInvoice, EInvoiceSummary } from '@/types/einvoice';

export function summarizeEInvoices(
  invoices: readonly EInvoice[],
): EInvoiceSummary {
  return invoices.reduce<EInvoiceSummary>(
    (summary, invoice) => ({
      count: summary.count + 1,
      totalBeforeTax: summary.totalBeforeTax + invoice.totalBeforeTax,
      totalVat: summary.totalVat + invoice.totalVat,
      totalAmount: summary.totalAmount + invoice.totalAmount,
    }),
    { count: 0, totalBeforeTax: 0, totalVat: 0, totalAmount: 0 },
  );
}
