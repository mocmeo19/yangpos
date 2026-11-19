import { MenuItemImage } from '@/components/menu/MenuItemImage';
import { formatCurrency } from '@/lib/format-currency';
import type { TopSellingItem } from '@/types/sales-report';

const FALLBACK_EMOJI = '🍽️';

export function TopItemsList({ items }: { items: readonly TopSellingItem[] }) {
  const maxQuantity = Math.max(1, ...items.map((item) => item.quantity));

  return (
    <section className="rounded-2xl border border-line bg-surface p-5 shadow-card">
      <h2 className="font-bold">Món bán chạy</h2>
      <p className="text-sm text-ink-soft">Xếp theo số phần đã bán</p>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-ink-soft">Chưa có món nào được bán.</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-3.5">
          {items.map((item, index) => (
            <li key={item.menuItemId} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-center text-sm font-bold text-ink-faint tabular-nums">
                {index + 1}
              </span>
              <MenuItemImage
                menuItem={{ name: item.name, emoji: FALLBACK_EMOJI }}
                className="size-11 rounded-xl text-lg"
                sizes="44px"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-semibold">{item.name}</span>
                  <span className="whitespace-nowrap text-ink-soft tabular-nums">
                    {item.quantity} phần
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{ width: `${(item.quantity / maxQuantity) * 100}%` }}
                  />
                </div>
              </div>
              <span className="hidden w-24 shrink-0 text-right text-sm font-semibold tabular-nums sm:block">
                {formatCurrency(item.revenue)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
