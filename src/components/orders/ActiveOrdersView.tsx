'use client';

import { Ban, BellRing, ChefHat, Plus, Printer, Vibrate } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { buttonClassName } from '@/components/ui/Button';
import {
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { useNow } from '@/hooks/use-now';
import { useStaffSession } from '@/hooks/use-staff-session';
import { useTableNameResolver } from '@/hooks/use-table-name-resolver';
import { formatOrderNumber } from '@/lib/format-order-number';
import { isOrderPaid } from '@/lib/is-order-paid';
import { ACTIVE_ORDER_STATUSES, ORDER_STATUS_LABELS } from '@/lib/order-status';
import type { ActiveOrderActions } from '@/types/active-order-actions';
import type { Order, OrderStatus } from '@/types/order';
import { KitchenTicket } from './KitchenTicket';
import { KitchenTicketActions } from './KitchenTicketActions';
import { ORDER_STATUS_ACCENT_CLASSES } from './order-status-styles';

type StatusFilter = 'all' | OrderStatus;

const ELAPSED_REFRESH_MS = 30_000;

interface ActiveOrdersViewProps {
  orders: readonly Order[];
  actions: ActiveOrderActions;
  isPagerEnabled: boolean;
}

export function ActiveOrdersView({
  orders,
  actions,
  isPagerEnabled,
}: ActiveOrdersViewProps) {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const now = useNow(ELAPSED_REFRESH_MS);
  const resolveTableName = useTableNameResolver();
  const { can } = useStaffSession();

  const filterOptions = useMemo<FilterChipOption<StatusFilter>[]>(
    () => [
      { value: 'all', label: 'Tất cả', count: orders.length },
      ...ACTIVE_ORDER_STATUSES.map((status) => ({
        value: status,
        label: ORDER_STATUS_LABELS[status],
        count: orders.filter((order) => order.status === status).length,
        dotClassName: ORDER_STATUS_ACCENT_CLASSES[status],
      })),
    ],
    [orders],
  );

  const visibleOrders =
    filter === 'all'
      ? orders
      : orders.filter((order) => order.status === filter);
  const hasNoOrders = orders.length === 0;

  /** Đơn đã thu tiền thì in hóa đơn thay cho phiếu tạm tính và không cho hủy. */
  function buildMenuItems(order: Order): DropdownMenuItem[] {
    const isPaid = isOrderPaid(order);
    const items: DropdownMenuItem[] = [];
    if (isPaid) {
      items.push({
        label: 'In hóa đơn',
        icon: Printer,
        onSelect: () => actions.printReceipt(order),
      });
    } else {
      items.push({
        label: 'In tạm tính',
        icon: Printer,
        onSelect: () => actions.printBill(order),
      });
    }
    if (order.tableId) {
      items.push({
        label: 'Gọi thêm món',
        icon: Plus,
        onSelect: () => actions.addItems(order),
      });
    }
    if (isPagerEnabled && !order.tableId) {
      items.push({
        label:
          order.pagerNumber === undefined ? 'Gắn thẻ rung' : 'Đổi thẻ rung',
        icon: Vibrate,
        onSelect: () => actions.assignPager(order),
      });
    }
    if (isPagerEnabled && order.pagerNumber !== undefined) {
      items.push({
        label: `Gọi thẻ ${order.pagerNumber}`,
        icon: BellRing,
        onSelect: () => actions.callPager(order),
      });
    }
    const cancel = actions.cancel;
    if (!isPaid && cancel) {
      items.push({
        label: 'Hủy đơn',
        icon: Ban,
        tone: 'danger',
        onSelect: () => cancel(order),
      });
    }
    return items;
  }

  return (
    <div className="flex flex-col gap-5">
      <FilterChips
        label="Lọc theo trạng thái"
        options={filterOptions}
        value={filter}
        onChange={setFilter}
      />
      {visibleOrders.length === 0 ? (
        <EmptyState
          icon={ChefHat}
          title={
            hasNoOrders ? 'Bếp đang rảnh' : 'Không có đơn ở trạng thái này'
          }
          description={
            hasNoOrders
              ? 'Đơn mới gửi từ màn hình Bán hàng sẽ xuất hiện tại đây.'
              : 'Chọn trạng thái khác để xem các đơn còn lại.'
          }
          action={
            can('pos.sell') && (
              <Link
                href="/"
                className={buttonClassName({
                  variant: 'secondary',
                  size: 'sm',
                })}
              >
                Tạo đơn mới
              </Link>
            )
          }
        />
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visibleOrders.map((order) => (
            <KitchenTicket
              key={order.id}
              order={order}
              tableName={resolveTableName(order.tableId)}
              now={now}
              actions={<KitchenTicketActions order={order} actions={actions} />}
              menu={
                <DropdownMenu
                  label={`Thao tác đơn ${formatOrderNumber(order.number)}`}
                  items={buildMenuItems(order)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
