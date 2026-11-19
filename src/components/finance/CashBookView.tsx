'use client';

import {
  ArrowDownLeft,
  ArrowUpRight,
  FileSpreadsheet,
  Scale,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { CASH_FUND_OPTIONS } from '@/data/cash-fund-options';
import { useCashBookSource } from '@/hooks/use-cash-book-source';
import { downloadFile } from '@/lib/dom/download-file';
import { buildCashBook } from '@/lib/finance/build-cash-book';
import { buildCashBookRows } from '@/lib/finance/build-cash-book-rows';
import { buildPeriodFileSuffix } from '@/lib/finance/build-period-file-suffix';
import { formatCurrency } from '@/lib/format-currency';
import { buildXlsx, XLSX_MIME_TYPE } from '@/lib/xlsx/build-xlsx';
import type { CashEntryType, CashFund } from '@/types/cash-entry';
import type { ResolvedFinancePeriod } from '@/types/finance-period';
import { CashBookTable } from './CashBookTable';
import { CashEntryFormDialog } from './CashEntryFormDialog';
import { FinanceMetric } from './FinanceMetric';

const SHEET_NAMES: Record<CashFund, string> = {
  cash: 'Sổ quỹ tiền mặt',
  bank: 'Sổ tiền gửi ngân hàng',
};

const FILE_PREFIXES: Record<CashFund, string> = {
  cash: 'so-quy-tien-mat',
  bank: 'so-tien-gui-ngan-hang',
};

/** Tiền mặt bán hàng vào quỹ tiền mặt; chuyển khoản và thẻ vào tài khoản ngân hàng. */
export function CashBookView({ period }: { period: ResolvedFinancePeriod }) {
  const [fund, setFund] = useState<CashFund>('cash');
  const [newEntryType, setNewEntryType] = useState<CashEntryType | null>(null);
  const source = useCashBookSource(period.range.end);
  const book = useMemo(
    () =>
      source
        ? buildCashBook({
            fund,
            range: period.range,
            orders: source.orders,
            entries: source.entries,
          })
        : null,
    [source, fund, period.range],
  );

  function handleExport() {
    if (!book) {
      return;
    }
    downloadFile(
      buildXlsx(SHEET_NAMES[fund], buildCashBookRows(book)),
      `${FILE_PREFIXES[fund]}_${buildPeriodFileSuffix(period.range)}.xlsx`,
      XLSX_MIME_TYPE,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          label="Quỹ"
          options={CASH_FUND_OPTIONS}
          value={fund}
          onChange={setFund}
          className="w-full sm:w-auto"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNewEntryType('receipt')}
          >
            <ArrowDownLeft className="size-4 text-success" />
            Phiếu thu
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNewEntryType('payment')}
          >
            <ArrowUpRight className="size-4 text-danger" />
            Phiếu chi
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!book}
            onClick={handleExport}
          >
            <FileSpreadsheet className="size-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {!book && <LoadingState />}
      {book && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <FinanceMetric
              icon={Wallet}
              label="Tồn đầu kỳ"
              value={formatCurrency(book.openingBalance)}
              hint={period.label}
            />
            <FinanceMetric
              icon={ArrowDownLeft}
              label="Tổng thu"
              value={formatCurrency(book.totalReceipts)}
            />
            <FinanceMetric
              icon={ArrowUpRight}
              label="Tổng chi"
              value={formatCurrency(book.totalPayments)}
            />
            <FinanceMetric
              icon={Scale}
              label="Tồn cuối kỳ"
              value={formatCurrency(book.closingBalance)}
              tone={book.closingBalance < 0 ? 'negative' : 'neutral'}
            />
          </div>
          <CashBookTable book={book} />
        </>
      )}

      {newEntryType && (
        <CashEntryFormDialog
          type={newEntryType}
          fund={fund}
          onClose={() => setNewEntryType(null)}
        />
      )}
    </div>
  );
}
