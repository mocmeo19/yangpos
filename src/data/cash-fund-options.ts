import { Banknote, Landmark } from 'lucide-react';
import type { SegmentedOption } from '@/components/ui/SegmentedControl';
import type { CashFund } from '@/types/cash-entry';

export const CASH_FUND_OPTIONS: readonly SegmentedOption<CashFund>[] = [
  { value: 'cash', label: 'Tiền mặt', icon: Banknote },
  { value: 'bank', label: 'Ngân hàng', icon: Landmark },
];
