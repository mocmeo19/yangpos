import { MenuItemImage } from '@/components/menu/MenuItemImage';
import { formatCurrency } from '@/lib/format-currency';
import type { CustomerDisplayLine } from '@/types/customer-display';

export function CustomerOrderLine({ line }: { line: CustomerDisplayLine }) {
  return (
    <li className="flex items-center gap-4 py-4 motion-safe:animate-fade-in">
      <MenuItemImage
        menuItem={line}
        sizes="64px"
        className="size-16 rounded-2xl text-3xl"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-semibold">{line.name}</p>
        {line.note && (
          <p className="truncate text-sm text-brand-dark italic">
            “{line.note}”
          </p>
        )}
        <p className="font-mono text-sm text-ink-soft tabular-nums">
          {line.quantity} × {formatCurrency(line.unitPrice)}
        </p>
      </div>
      <p className="font-mono text-lg font-semibold whitespace-nowrap tabular-nums">
        {formatCurrency(line.unitPrice * line.quantity)}
      </p>
    </li>
  );
}
