import { Plus } from 'lucide-react';
import { MenuItemImage } from '@/components/menu/MenuItemImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import type { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  menuItem: MenuItem;
  quantityInCart: number;
  imageLoading: 'eager' | 'lazy';
  onAdd: (menuItem: MenuItem) => void;
  onChangeQuantity: (menuItemId: string, delta: number) => void;
}

const IMAGE_SIZES =
  '(max-width: 639px) 50vw, (max-width: 1023px) 33vw, (max-width: 1535px) 25vw, 20vw';

export function MenuItemCard({
  menuItem,
  quantityInCart,
  imageLoading,
  onAdd,
  onChangeQuantity,
}: MenuItemCardProps) {
  const isInCart = quantityInCart > 0;
  const { isAvailable } = menuItem;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border bg-surface shadow-card transition',
        isInCart
          ? 'border-brand ring-2 ring-brand/15'
          : 'border-line hover:-translate-y-0.5 hover:shadow-raised',
        !isAvailable && 'opacity-60 grayscale',
      )}
    >
      <div className="relative">
        <MenuItemImage
          menuItem={menuItem}
          className="aspect-[4/3] w-full text-5xl"
          sizes={IMAGE_SIZES}
          loading={imageLoading}
        />
        {!isAvailable && (
          <span className="absolute top-2 left-2 rounded-full bg-ink/85 px-2.5 py-1 text-[11px] font-semibold text-white">
            Hết món
          </span>
        )}
        {isAvailable && isInCart && (
          <QuantityStepper
            quantity={quantityInCart}
            itemName={menuItem.name}
            onDecrease={() => onChangeQuantity(menuItem.id, -1)}
            onIncrease={() => onChangeQuantity(menuItem.id, 1)}
            className="absolute right-2 bottom-2 z-10"
          />
        )}
        {isAvailable && !isInCart && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-2 bottom-2 grid size-9 place-items-center rounded-full bg-brand text-white shadow-raised transition-transform group-hover:scale-110"
          >
            <Plus className="size-5" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm leading-5 font-semibold">
          {menuItem.name}
        </h3>
        <p className="mt-auto font-mono text-[15px] font-semibold text-brand">
          {formatCurrency(menuItem.price)}
        </p>
      </div>
      {/* Cả thẻ là vùng bấm để thêm món; bộ tăng giảm nằm lớp trên nên vẫn bấm riêng được. */}
      <button
        type="button"
        disabled={!isAvailable}
        onClick={() => onAdd(menuItem)}
        aria-label={`Thêm ${menuItem.name} vào phiếu`}
        className="absolute inset-0 rounded-2xl focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed"
      />
    </article>
  );
}
