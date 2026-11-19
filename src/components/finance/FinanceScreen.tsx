'use client';

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { useHashTab } from '@/hooks/use-hash-tab';
import { useNow } from '@/hooks/use-now';
import { toDateInputValue } from '@/lib/day-range';
import { resolveFinancePeriod } from '@/lib/finance/resolve-finance-period';
import type { FinancePeriodSelection } from '@/types/finance-period';
import { CashBookView } from './CashBookView';
import { EInvoiceListView } from './EInvoiceListView';
import { FinancePeriodPicker } from './FinancePeriodPicker';
import { ProfitLossView } from './ProfitLossView';

type FinanceTab = 'overview' | 'cash-book' | 'invoices';

const FINANCE_TABS: readonly FinanceTab[] = [
  'overview',
  'cash-book',
  'invoices',
];

const TAB_OPTIONS: readonly SegmentedOption<FinanceTab>[] = [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'cash-book', label: 'Sổ quỹ' },
  { value: 'invoices', label: 'Hóa đơn' },
];

const INITIAL_PERIOD: FinancePeriodSelection = {
  kind: 'preset',
  preset: 'thisMonth',
};
// Cập nhật "hôm nay" khi trang được để mở qua nửa đêm.
const DAY_CHECK_INTERVAL_MS = 60_000;

export function FinanceScreen() {
  const [tab, setTab] = useHashTab(FINANCE_TABS, 'overview');
  const [selection, setSelection] =
    useState<FinancePeriodSelection>(INITIAL_PERIOD);
  const now = useNow(DAY_CHECK_INTERVAL_MS);
  const todayValue = toDateInputValue(new Date(now));
  const period = useMemo(
    () => resolveFinancePeriod(selection, todayValue),
    [selection, todayValue],
  );

  return (
    <>
      <PageHeader
        title="Tài chính"
        description={`Lãi lỗ, sổ quỹ thu chi và hóa đơn điện tử · ${period.label}`}
      />
      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <SegmentedControl
          label="Mục tài chính"
          options={TAB_OPTIONS}
          value={tab}
          onChange={setTab}
          className="w-full sm:w-auto"
        />
        <FinancePeriodPicker
          selection={selection}
          maxDate={todayValue}
          onChange={setSelection}
        />
      </div>

      {tab === 'overview' && (
        <ProfitLossView
          period={period}
          onOpenInvoices={() => setTab('invoices')}
        />
      )}
      {tab === 'cash-book' && <CashBookView period={period} />}
      {tab === 'invoices' && <EInvoiceListView period={period} />}
    </>
  );
}
