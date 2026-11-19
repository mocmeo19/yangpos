'use client';

import { Banknote, Receipt, ShoppingBasket, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useNow } from '@/hooks/use-now';
import { usePaidOrdersInRange } from '@/hooks/use-paid-orders-in-range';
import { buildRevenueSeries } from '@/lib/build-revenue-series';
import { buildSalesReport } from '@/lib/build-sales-report';
import { toDateInputValue } from '@/lib/day-range';
import { formatCurrency } from '@/lib/format-currency';
import { calculatePercentChange } from '@/lib/percent-change';
import { resolveReportRange } from '@/lib/resolve-report-range';
import type { ReportSelection } from '@/types/report-range';
import { PaymentBreakdown } from './PaymentBreakdown';
import { ReportRangePicker } from './ReportRangePicker';
import { RevenueChart } from './RevenueChart';
import { StatCard } from './StatCard';
import { TopItemsList } from './TopItemsList';

const INITIAL_SELECTION: ReportSelection = { kind: 'preset', preset: 'today' };
// Cập nhật "hôm nay" khi trang được để mở qua nửa đêm.
const DAY_CHECK_INTERVAL_MS = 60_000;

export function ReportsView() {
  const [selection, setSelection] =
    useState<ReportSelection>(INITIAL_SELECTION);
  const now = useNow(DAY_CHECK_INTERVAL_MS);
  const todayValue = toDateInputValue(new Date(now));
  const range = useMemo(
    () => resolveReportRange(selection, todayValue),
    [selection, todayValue],
  );
  const { currentPeriod, previousPeriod, granularity } = range;
  const currentOrders = usePaidOrdersInRange(currentPeriod);
  const previousOrders = usePaidOrdersInRange(previousPeriod);

  const report = useMemo(
    () => (currentOrders ? buildSalesReport(currentOrders) : null),
    [currentOrders],
  );
  const previousReport = useMemo(
    () => (previousOrders ? buildSalesReport(previousOrders) : null),
    [previousOrders],
  );
  const revenueSeries = useMemo(
    () =>
      currentOrders
        ? buildRevenueSeries(currentOrders, currentPeriod, granularity)
        : [],
    [currentOrders, currentPeriod, granularity],
  );

  return (
    <>
      <PageHeader
        title="Báo cáo"
        description="Doanh thu tính trên các đơn đã thanh toán."
      />
      <ReportRangePicker
        selection={selection}
        maxDate={todayValue}
        onChange={setSelection}
      />

      {report && previousReport ? (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <StatCard
              icon={Banknote}
              label="Doanh thu"
              value={formatCurrency(report.revenue)}
              change={calculatePercentChange(
                report.revenue,
                previousReport.revenue,
              )}
              comparisonLabel={range.comparisonLabel}
            />
            <StatCard
              icon={Receipt}
              label="Số đơn"
              value={String(report.orderCount)}
              change={calculatePercentChange(
                report.orderCount,
                previousReport.orderCount,
              )}
              comparisonLabel={range.comparisonLabel}
            />
            <StatCard
              icon={TrendingUp}
              label="Trung bình mỗi đơn"
              value={formatCurrency(Math.round(report.averageOrderValue))}
              change={calculatePercentChange(
                report.averageOrderValue,
                previousReport.averageOrderValue,
              )}
              comparisonLabel={range.comparisonLabel}
            />
            <StatCard
              icon={ShoppingBasket}
              label="Món đã bán"
              value={String(report.itemsSold)}
              change={calculatePercentChange(
                report.itemsSold,
                previousReport.itemsSold,
              )}
              comparisonLabel={range.comparisonLabel}
            />
          </div>

          <RevenueChart
            title={
              granularity === 'hour'
                ? 'Doanh thu theo giờ'
                : 'Doanh thu theo ngày'
            }
            points={revenueSeries}
          />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <TopItemsList items={report.topItems} />
            <PaymentBreakdown
              totals={report.revenueByPaymentMethod}
              revenue={report.revenue}
            />
          </div>
        </div>
      ) : (
        <LoadingState />
      )}
    </>
  );
}
