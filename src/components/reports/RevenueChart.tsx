'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { formatCompactNumber } from '@/lib/format-compact-number';
import { formatCurrency } from '@/lib/format-currency';
import { buildNiceTicks } from '@/lib/nice-ticks';
import type { RevenuePoint } from '@/types/revenue-point';

const PLOT_HEIGHT_PX = 220;
const MAX_AXIS_LABELS = 8;

interface RevenueChartProps {
  title: string;
  points: readonly RevenuePoint[];
}

function toPercent(value: number, scaleMax: number): string {
  return `${(value / scaleMax) * 100}%`;
}

export function RevenueChart({ title, points }: RevenueChartProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const maxValue = Math.max(0, ...points.map((point) => point.value));
  const ticks = buildNiceTicks(maxValue);
  const scaleMax = ticks[ticks.length - 1] || 1;
  const peakKey =
    maxValue > 0
      ? points.find((point) => point.value === maxValue)?.key
      : undefined;
  const activePoint = points.find((point) => point.key === activeKey);
  const labelStep = Math.ceil(points.length / MAX_AXIS_LABELS);

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <header className="mb-5 flex items-start justify-between gap-4">
        <h2 className="font-bold">{title}</h2>
        <div aria-live="polite" className="min-h-10 text-right">
          {activePoint ? (
            <>
              <p className="text-base font-semibold">
                {formatCurrency(activePoint.value)}
              </p>
              <p className="text-xs text-ink-soft">
                {activePoint.fullLabel} · {activePoint.orderCount} đơn
              </p>
            </>
          ) : (
            <p className="hidden text-xs text-ink-faint sm:block">
              Chạm hoặc rê chuột vào cột để xem chi tiết
            </p>
          )}
        </div>
      </header>

      {maxValue === 0 ? (
        <p
          className="grid place-items-center text-sm text-ink-soft"
          style={{ height: PLOT_HEIGHT_PX }}
        >
          Chưa có doanh thu trong khoảng thời gian này.
        </p>
      ) : (
        <div className="flex gap-3">
          <div
            aria-hidden="true"
            className="relative w-11 shrink-0"
            style={{ height: PLOT_HEIGHT_PX }}
          >
            {ticks.map((tick) => (
              <span
                key={tick}
                className="absolute right-0 translate-y-1/2 text-[11px] whitespace-nowrap text-ink-faint tabular-nums"
                style={{ bottom: toPercent(tick, scaleMax) }}
              >
                {formatCompactNumber(tick)}
              </span>
            ))}
          </div>

          <div className="min-w-0 flex-1">
            <div className="relative" style={{ height: PLOT_HEIGHT_PX }}>
              {ticks.map((tick) => (
                <div
                  key={tick}
                  aria-hidden="true"
                  className="absolute inset-x-0 border-t border-line"
                  style={{ bottom: toPercent(tick, scaleMax) }}
                />
              ))}
              <ol className="absolute inset-0 flex items-end">
                {points.map((point) => {
                  const barHeight = toPercent(point.value, scaleMax);
                  const isActive = point.key === activeKey;
                  return (
                    <li
                      key={point.key}
                      className="flex h-full min-w-0 flex-1 justify-center px-px"
                    >
                      <button
                        type="button"
                        aria-label={`${point.fullLabel}: ${formatCurrency(point.value)}, ${point.orderCount} đơn`}
                        onPointerEnter={() => setActiveKey(point.key)}
                        onPointerLeave={() => setActiveKey(null)}
                        onFocus={() => setActiveKey(point.key)}
                        onBlur={() => setActiveKey(null)}
                        onClick={() => setActiveKey(point.key)}
                        className="relative flex h-full w-full items-end justify-center rounded-md transition-colors hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:outline-none"
                      >
                        {point.key === peakKey && (
                          <span
                            className="absolute text-[11px] font-semibold whitespace-nowrap text-ink-soft"
                            style={{ bottom: `calc(${barHeight} + 4px)` }}
                          >
                            {formatCompactNumber(point.value)}
                          </span>
                        )}
                        <span
                          className={cn(
                            'w-full max-w-6 rounded-t-[4px] transition-colors',
                            isActive ? 'bg-brand-dark' : 'bg-brand',
                          )}
                          style={{ height: barHeight }}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            <ol aria-hidden="true" className="mt-2 flex">
              {points.map((point, index) => (
                <li
                  key={point.key}
                  className="min-w-0 flex-1 text-center text-[11px] whitespace-nowrap text-ink-faint"
                >
                  {index % labelStep === 0 ? point.label : ''}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-ink-soft hover:text-ink">
          Xem dạng bảng
        </summary>
        <table className="mt-3 w-full text-left">
          <thead className="text-xs text-ink-soft">
            <tr>
              <th scope="col" className="py-2 font-medium">
                Thời gian
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Số đơn
              </th>
              <th scope="col" className="py-2 text-right font-medium">
                Doanh thu
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {points.map((point) => (
              <tr key={point.key}>
                <td className="py-2">{point.fullLabel}</td>
                <td className="py-2 text-right tabular-nums">
                  {point.orderCount}
                </td>
                <td className="py-2 text-right tabular-nums">
                  {formatCurrency(point.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
