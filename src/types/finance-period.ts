import type { TimeRange } from '@/lib/day-range';

export type FinancePreset = 'today' | 'thisMonth' | 'lastMonth';

export type FinancePeriodSelection =
  | { kind: 'preset'; preset: FinancePreset }
  | { kind: 'custom'; from: string; to: string };

export interface ResolvedFinancePeriod {
  range: TimeRange;
  label: string;
}
