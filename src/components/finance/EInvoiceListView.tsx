'use client';

import {
  Banknote,
  Calculator,
  FileSpreadsheet,
  Landmark,
  ReceiptText,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { EInvoiceDetailDialog } from '@/components/einvoice/EInvoiceDetailDialog';
import { SettingsNote } from '@/components/settings/SettingsNote';
import { Button, buttonClassName } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { useEInvoicesInRange } from '@/hooks/use-einvoices-in-range';
import { usePeriodSales } from '@/hooks/use-period-sales';
import { useSettings } from '@/hooks/use-settings';
import { downloadFile } from '@/lib/dom/download-file';
import { buildInvoiceLedgerRows } from '@/lib/finance/build-invoice-ledger-rows';
import { buildPeriodFileSuffix } from '@/lib/finance/build-period-file-suffix';
import { findUninvoicedOrders } from '@/lib/finance/find-uninvoiced-orders';
import { summarizeEInvoices } from '@/lib/finance/summarize-einvoices';
import { formatCurrency } from '@/lib/format-currency';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import { buildXlsx, XLSX_MIME_TYPE } from '@/lib/xlsx/build-xlsx';
import type { ResolvedFinancePeriod } from '@/types/finance-period';
import { EInvoiceTable } from './EInvoiceTable';
import { FinanceMetric } from './FinanceMetric';
import { UninvoicedOrdersPanel } from './UninvoicedOrdersPanel';

/** Hóa đơn lập trong kỳ (theo ngày lập, như bảng kê khai thuế) và các đơn còn thiếu hóa đơn. */
export function EInvoiceListView({
  period,
}: {
  period: ResolvedFinancePeriod;
}) {
  const { settings } = useSettings();
  const invoices = useEInvoicesInRange(period.range);
  const sales = usePeriodSales(period.range);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sortedInvoices = useMemo(
    () =>
      [...(invoices ?? [])].sort(
        (first, second) => second.issuedAt - first.issuedAt,
      ),
    [invoices],
  );
  const summary = useMemo(
    () => summarizeEInvoices(sortedInvoices),
    [sortedInvoices],
  );
  const uninvoicedOrders = useMemo(
    () => (sales ? findUninvoicedOrders(sales.orders, sales.invoices) : []),
    [sales],
  );
  // Tìm lại trong danh sách đang theo dõi để trạng thái gửi cập nhật ngay trong hộp thoại.
  const selectedInvoice =
    sortedInvoices.find((invoice) => invoice.id === selectedId) ?? null;
  const hasSandboxInvoices = sortedInvoices.some(
    (invoice) => invoice.isSandbox,
  );
  const showsUninvoicedOrders =
    settings.eInvoice.enabled && uninvoicedOrders.length > 0;

  function handleExport() {
    downloadFile(
      buildXlsx('Bảng kê hóa đơn', buildInvoiceLedgerRows(sortedInvoices)),
      `bang-ke-hoa-don_${buildPeriodFileSuffix(period.range)}.xlsx`,
      XLSX_MIME_TYPE,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {!settings.eInvoice.enabled && (
        <SettingsNote tone="warning" title="Chưa bật hóa đơn điện tử">
          <p>
            Bật trong Cài đặt để mỗi lần thanh toán tự lập hóa đơn khởi tạo từ
            máy tính tiền theo Nghị định 70/2025/NĐ-CP.
          </p>
          <Link
            href={getSettingsSectionHref('eInvoice')}
            className={buttonClassName({
              variant: 'secondary',
              size: 'sm',
              className: 'mt-2',
            })}
          >
            Mở cài đặt hóa đơn
          </Link>
        </SettingsNote>
      )}
      {hasSandboxInvoices && (
        <SettingsNote tone="warning" title="Có hóa đơn lập ở chế độ thử nghiệm">
          Các hóa đơn này chưa gửi tới cơ quan thuế nên không có giá trị pháp
          lý.
        </SettingsNote>
      )}

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <FinanceMetric
          icon={ReceiptText}
          label="Số hóa đơn"
          value={String(summary.count)}
          hint={period.label}
        />
        <FinanceMetric
          icon={Calculator}
          label="Tiền hàng chưa thuế"
          value={formatCurrency(summary.totalBeforeTax)}
        />
        <FinanceMetric
          icon={Landmark}
          label="Thuế GTGT"
          value={formatCurrency(summary.totalVat)}
        />
        <FinanceMetric
          icon={Banknote}
          label="Tổng thanh toán"
          value={formatCurrency(summary.totalAmount)}
        />
      </div>

      {showsUninvoicedOrders && (
        <UninvoicedOrdersPanel orders={uninvoicedOrders} />
      )}

      <section
        aria-labelledby="einvoice-list-title"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="einvoice-list-title" className="font-semibold">
            Hóa đơn đã lập
          </h2>
          <Button
            variant="secondary"
            size="sm"
            disabled={sortedInvoices.length === 0}
            onClick={handleExport}
          >
            <FileSpreadsheet className="size-4" />
            Xuất bảng kê Excel
          </Button>
        </div>
        {!invoices && <LoadingState />}
        {invoices && sortedInvoices.length === 0 && (
          <EmptyState
            icon={ReceiptText}
            title="Chưa có hóa đơn trong kỳ"
            description="Hóa đơn được lập khi thanh toán, hoặc lập bù cho đơn đã thu tiền."
          />
        )}
        {sortedInvoices.length > 0 && (
          <EInvoiceTable
            invoices={sortedInvoices}
            onSelect={(invoice) => setSelectedId(invoice.id)}
          />
        )}
      </section>

      {selectedInvoice && (
        <EInvoiceDetailDialog
          invoice={selectedInvoice}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
