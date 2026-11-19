'use client';

import { Banknote, HandCoins, Landmark, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { SettingsNote } from '@/components/settings/SettingsNote';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useCashEntriesInRange } from '@/hooks/use-cash-entries-in-range';
import { usePeriodSales } from '@/hooks/use-period-sales';
import { useSettings } from '@/hooks/use-settings';
import { buildProfitLoss } from '@/lib/finance/build-profit-loss';
import { toAmountTone } from '@/lib/finance/to-amount-tone';
import { formatCurrency } from '@/lib/format-currency';
import type { ResolvedFinancePeriod } from '@/types/finance-period';
import { FinanceMetric } from './FinanceMetric';
import { ProfitLossStatement } from './ProfitLossStatement';

interface ProfitLossViewProps {
  period: ResolvedFinancePeriod;
  onOpenInvoices: () => void;
}

export function ProfitLossView({
  period,
  onOpenInvoices,
}: ProfitLossViewProps) {
  const { settings } = useSettings();
  const sales = usePeriodSales(period.range);
  const entries = useCashEntriesInRange(period.range);
  const profitLoss = useMemo(() => {
    if (!sales || !entries) {
      return null;
    }
    return buildProfitLoss({
      orders: sales.orders,
      invoices: sales.invoices,
      entries,
    });
  }, [sales, entries]);

  if (!profitLoss) {
    return <LoadingState />;
  }

  const hasInvoiceGap =
    settings.eInvoice.enabled && profitLoss.uninvoicedOrderCount > 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <FinanceMetric
          icon={Banknote}
          label="Doanh thu"
          value={formatCurrency(profitLoss.grossRevenue)}
          hint={`${profitLoss.orderCount} đơn, đã gồm thuế`}
        />
        <FinanceMetric
          icon={Landmark}
          label="Thuế GTGT đầu ra"
          value={formatCurrency(profitLoss.outputVat)}
          hint="Trên hóa đơn đã lập"
        />
        <FinanceMetric
          icon={HandCoins}
          label="Chi phí"
          value={formatCurrency(profitLoss.totalExpenses)}
          hint="Theo phiếu chi trong kỳ"
        />
        <FinanceMetric
          icon={TrendingUp}
          label="Lợi nhuận"
          value={formatCurrency(profitLoss.profit)}
          hint={period.label}
          tone={toAmountTone(profitLoss.profit)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
        <ProfitLossStatement
          profitLoss={profitLoss}
          periodLabel={period.label}
        />
        <div className="flex flex-col gap-4">
          {hasInvoiceGap && (
            <SettingsNote
              tone="warning"
              title={`${profitLoss.uninvoicedOrderCount} đơn chưa lập hóa đơn`}
            >
              <p>
                {formatCurrency(profitLoss.uninvoicedRevenue)} đã thu nhưng chưa
                có hóa đơn điện tử nên chưa tách thuế GTGT.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={onOpenInvoices}
              >
                Lập hóa đơn bù
              </Button>
            </SettingsNote>
          )}
          <SettingsNote title="Cách tính">
            Lợi nhuận tính theo tiền thực thu, thực chi trong kỳ: doanh thu trừ
            thuế GTGT trên hóa đơn, cộng thu nhập khác, trừ phiếu chi. Góp vốn,
            rút vốn, chuyển quỹ và nộp thuế không tính vào lãi lỗ. Số liệu dùng
            để theo dõi kinh doanh, không thay cho sổ kế toán theo quy định.
          </SettingsNote>
        </div>
      </div>
    </div>
  );
}
