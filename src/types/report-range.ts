import type { TimeRange } from '@/lib/day-range';

export type ReportPreset = 'today' | 'yesterday' | 'last7Days' | 'last30Days';

export type ReportSelection =
  { kind: 'preset'; preset: ReportPreset } | { kind: 'day'; date: string };

export type ReportGranularity = 'hour' | 'day';

export interface ResolvedReportRange {
  currentPeriod: TimeRange;
  /** Khoảng liền trước và dài bằng kỳ đang xem, dùng để so sánh. */
  previousPeriod: TimeRange;
  granularity: ReportGranularity;
  comparisonLabel: string;
}
