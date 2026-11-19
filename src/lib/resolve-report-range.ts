import type {
  ReportPreset,
  ReportSelection,
  ResolvedReportRange,
} from '@/types/report-range';
import { addDays, parseDateInputValue, type TimeRange } from './day-range';

interface PresetSpec {
  startOffsetDays: number;
  dayCount: number;
  comparisonLabel: string;
}

const PRESET_SPECS: Record<ReportPreset, PresetSpec> = {
  today: { startOffsetDays: 0, dayCount: 1, comparisonLabel: 'so với hôm qua' },
  yesterday: {
    startOffsetDays: -1,
    dayCount: 1,
    comparisonLabel: 'so với hôm kia',
  },
  last7Days: {
    startOffsetDays: -6,
    dayCount: 7,
    comparisonLabel: 'so với 7 ngày trước đó',
  },
  last30Days: {
    startOffsetDays: -29,
    dayCount: 30,
    comparisonLabel: 'so với 30 ngày trước đó',
  },
};

function buildRange(start: Date, dayCount: number): TimeRange {
  return { start: start.getTime(), end: addDays(start, dayCount).getTime() };
}

function resolveFromStart(
  start: Date,
  dayCount: number,
  comparisonLabel: string,
): ResolvedReportRange {
  return {
    currentPeriod: buildRange(start, dayCount),
    previousPeriod: buildRange(addDays(start, -dayCount), dayCount),
    granularity: dayCount === 1 ? 'hour' : 'day',
    comparisonLabel,
  };
}

export function resolveReportRange(
  selection: ReportSelection,
  todayValue: string,
): ResolvedReportRange {
  if (selection.kind === 'day') {
    return resolveFromStart(
      parseDateInputValue(selection.date),
      1,
      'so với ngày trước đó',
    );
  }

  const spec = PRESET_SPECS[selection.preset];
  const start = addDays(parseDateInputValue(todayValue), spec.startOffsetDays);
  return resolveFromStart(start, spec.dayCount, spec.comparisonLabel);
}
