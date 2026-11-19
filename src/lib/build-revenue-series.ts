import type { Order } from '@/types/order';
import type { ReportGranularity } from '@/types/report-range';
import type { RevenuePoint } from '@/types/revenue-point';
import { addDays, toDateInputValue, type TimeRange } from './day-range';
import { calculateItemsTotal } from './order-totals';

const HOURS_PER_DAY = 24;
// Khung giờ mở cửa thường gặp; giờ nằm ngoài khung chỉ hiện khi thực sự có đơn.
const DEFAULT_FIRST_HOUR = 8;
const DEFAULT_LAST_HOUR = 22;

const shortDayFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
});

const fullDayFormatter = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
});

function padHour(hour: number): string {
  return String(hour).padStart(2, '0');
}

function createHourPoint(hour: number): RevenuePoint {
  return {
    key: `hour-${hour}`,
    label: `${hour}h`,
    fullLabel: `${padHour(hour)}:00 – ${padHour(hour + 1)}:00`,
    value: 0,
    orderCount: 0,
  };
}

function buildHourlySeries(paidOrders: readonly Order[]): RevenuePoint[] {
  const points = Array.from({ length: HOURS_PER_DAY }, (_, hour) =>
    createHourPoint(hour),
  );
  let firstHour = DEFAULT_FIRST_HOUR;
  let lastHour = DEFAULT_LAST_HOUR;

  for (const order of paidOrders) {
    if (order.paidAt === null) {
      continue;
    }
    const hour = new Date(order.paidAt).getHours();
    points[hour].value += calculateItemsTotal(order.items);
    points[hour].orderCount += 1;
    firstHour = Math.min(firstHour, hour);
    lastHour = Math.max(lastHour, hour);
  }

  return points.slice(firstHour, lastHour + 1);
}

function buildDailySeries(
  paidOrders: readonly Order[],
  range: TimeRange,
): RevenuePoint[] {
  const pointsByDay = new Map<string, RevenuePoint>();

  for (
    let day = new Date(range.start);
    day.getTime() < range.end;
    day = addDays(day, 1)
  ) {
    const key = toDateInputValue(day);
    pointsByDay.set(key, {
      key,
      label: shortDayFormatter.format(day),
      fullLabel: fullDayFormatter.format(day),
      value: 0,
      orderCount: 0,
    });
  }

  for (const order of paidOrders) {
    if (order.paidAt === null) {
      continue;
    }
    const point = pointsByDay.get(toDateInputValue(new Date(order.paidAt)));
    if (point) {
      point.value += calculateItemsTotal(order.items);
      point.orderCount += 1;
    }
  }

  return [...pointsByDay.values()];
}

export function buildRevenueSeries(
  paidOrders: readonly Order[],
  range: TimeRange,
  granularity: ReportGranularity,
): RevenuePoint[] {
  if (granularity === 'hour') {
    return buildHourlySeries(paidOrders);
  }
  return buildDailySeries(paidOrders, range);
}
