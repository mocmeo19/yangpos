import { Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { Switch } from '@/components/ui/Switch';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import type { MenuItem } from '@/types/menu';
import { MenuItemImage } from './MenuItemImage';

interface MenuItemRowProps {
  menuItem: MenuItem;
  categoryName: string;
  onToggleAvailability: (menuItem: MenuItem) => void;
  onEdit: (menuItem: MenuItem) => void;
  onDelete: (menuItem: MenuItem) => void;
}

export function MenuItemRow({
  menuItem,
  categoryName,
  onToggleAvailability,
  onEdit,
  onDelete,
}: MenuItemRowProps) {
  const { isAvailable } = menuItem;

  return (
    <li className="flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-4">
      <button
        type="button"
        onClick={() => onEdit(menuItem)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left sm:gap-4"
      >
        <MenuItemImage
          menuItem={menuItem}
          className={cn(
            'size-14 rounded-xl text-2xl',
            !isAvailable && 'opacity-50 grayscale',
          )}
          sizes="56px"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold">{menuItem.name}</span>
          <span className="block truncate text-xs text-ink-soft">
            {categoryName}
            {menuItem.barcode && (
              <span className="font-mono"> · {menuItem.barcode}</span>
            )}
          </span>
          <span className="mt-0.5 block font-mono text-sm font-semibold text-brand sm:hidden">
            {formatCurrency(menuItem.price)}
          </span>
        </span>
      </button>
      <p className="hidden w-28 text-right font-mono text-sm font-semibold tabular-nums sm:block">
        {formatCurrency(menuItem.price)}
      </p>
      <div className="flex items-center gap-2 sm:w-32 sm:justify-end">
        <span
          className={cn(
            'hidden text-xs font-semibold md:inline',
            isAvailable ? 'text-success' : 'text-ink-faint',
          )}
        >
          {isAvailable ? 'Đang bán' : 'Hết món'}
        </span>
        <Switch
          checked={isAvailable}
          label={`Đang bán ${menuItem.name}`}
          onChange={() => onToggleAvailability(menuItem)}
        />
      </div>
      <DropdownMenu
        label={`Thao tác ${menuItem.name}`}
        items={[
          { label: 'Sửa món', icon: Pencil, onSelect: () => onEdit(menuItem) },
          {
            label: 'Xóa món',
            icon: Trash2,
            tone: 'danger',
            onSelect: () => onDelete(menuItem),
          },
        ]}
      />
    </li>
  );
}
