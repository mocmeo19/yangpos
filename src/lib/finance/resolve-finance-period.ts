import { addDays, parseDateInputValue, type TimeRange } from '@/lib/day-range';
import { formatDate } from '@/lib/format-time';
import type {
  FinancePeriodSelection,
  ResolvedFinancePeriod,
} from '@/types/finance-period';

function monthRange(year: number, month: number): TimeRange {
  return {
    start: new Date(year, month, 1).getTime(),
    end: new Date(year, month + 1, 1).getTime(),
  };
}

function resolveCustom(from: string, to: string): ResolvedFinancePeriod {
  // Chuỗi YYYY-MM-DD so được theo thứ tự chữ nên tự đổi chỗ khi chọn ngược.
  const [first, last] = [from, to].sort();
  const start = parseDateInputValue(first);
  const lastDay = parseDateInputValue(last);
  return {
    range: { start: start.getTime(), end: addDays(lastDay, 1).getTime() },
    label: `${formatDate(start.getTime())} – ${formatDate(lastDay.getTime())}`,
  };
}

export function resolveFinancePeriod(
  selection: FinancePeriodSelection,
  todayValue: string,
): ResolvedFinancePeriod {
  if (selection.kind === 'custom') {
    return resolveCustom(selection.from, selection.to);
  }
  const today = parseDateInputValue(todayValue);
  const year = today.getFullYear();
  const month = today.getMonth();
  switch (selection.preset) {
    case 'today':
      return {
        range: { start: today.getTime(), end: addDays(today, 1).getTime() },
        label: `Hôm nay, ${formatDate(today.getTime())}`,
      };
    case 'thisMonth':
      return {
        range: monthRange(year, month),
        label: `Tháng ${month + 1}/${year}`,
      };
    case 'lastMonth': {
      const lastMonth = new Date(year, month - 1, 1);
      return {
        range: monthRange(lastMonth.getFullYear(), lastMonth.getMonth()),
        label: `Tháng ${lastMonth.getMonth() + 1}/${lastMonth.getFullYear()}`,
      };
    }
  }
}
