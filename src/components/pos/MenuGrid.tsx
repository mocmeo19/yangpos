import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { CartLine } from '@/types/cart';
import type { MenuItem } from '@/types/menu';
import { MenuItemCard } from './MenuItemCard';

// Hai hàng đầu luôn nằm trong màn hình đầu tiên nên tải ảnh ngay thay vì đợi cuộn tới.
const EAGER_IMAGE_COUNT = 8;

interface MenuGridProps {
  menuItems: readonly MenuItem[];
  cartLines: readonly CartLine[];
  onAdd: (menuItem: MenuItem) => void;
  onChangeQuantity: (menuItemId: string, delta: number) => void;
  onClearFilters: () => void;
}

export function MenuGrid({
  menuItems,
  cartLines,
  onAdd,
  onChangeQuantity,
  onClearFilters,
}: MenuGridProps) {
  if (menuItems.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="Không tìm thấy món phù hợp"
        description="Thử từ khóa khác hoặc xem toàn bộ thực đơn."
        action={
          <Button variant="secondary" size="sm" onClick={onClearFilters}>
            Xem tất cả món
          </Button>
        }
      />
    );
  }

  const quantities = new Map(
    cartLines.map((line) => [line.menuItemId, line.quantity]),
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {menuItems.map((menuItem, index) => (
        <MenuItemCard
          key={menuItem.id}
          menuItem={menuItem}
          quantityInCart={quantities.get(menuItem.id) ?? 0}
          imageLoading={index < EAGER_IMAGE_COUNT ? 'eager' : 'lazy'}
          onAdd={onAdd}
          onChangeQuantity={onChangeQuantity}
        />
      ))}
    </div>
  );
}
