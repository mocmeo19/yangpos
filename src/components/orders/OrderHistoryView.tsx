'use client';

import { History } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { LoadingState } from '@/components/ui/LoadingState';
import { useClosedOrders } from '@/hooks/use-closed-orders';
import { useTableNameResolver } from '@/hooks/use-table-name-resolver';
import type { Order } from '@/types/order';
import { OrderDetailDialog } from './OrderDetailDialog';
import { OrderHistoryRow } from './OrderHistoryRow';
import { ORDER_STATUS_ACCENT_CLASSES } from './order-status-styles';

type HistoryStatus = 'paid' | 'cancelled';

const HISTORY_LIMIT = 100;

const HISTORY_OPTIONS: readonly FilterChipOption<HistoryStatus>[] = [
  {
    value: 'paid',
    label: 'Đã thanh toán',
    dotClassName: ORDER_STATUS_ACCENT_CLASSES.paid,
  },
  {
    value: 'cancelled',
    label: 'Đã hủy',
    dotClassName: ORDER_STATUS_ACCENT_CLASSES.cancelled,
  },
];

const EMPTY_TITLES: Record<HistoryStatus, string> = {
  paid: 'Chưa có đơn nào được thanh toán',
  cancelled: 'Chưa có đơn nào bị hủy',
};

export function OrderHistoryView() {
  const [status, setStatus] = useState<HistoryStatus>('paid');
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const orders = useClosedOrders(status, HISTORY_LIMIT);
  const resolveTableName = useTableNameResolver();

  return (
    <div className="flex flex-col gap-5">
      <FilterChips
        label="Lọc lịch sử đơn"
        options={HISTORY_OPTIONS}
        value={status}
        onChange={setStatus}
      />

      {!orders && <LoadingState />}
      {orders?.length === 0 && (
        <EmptyState icon={History} title={EMPTY_TITLES[status]} />
      )}
      {orders && orders.length > 0 && (
        <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
          {orders.map((order) => (
            <OrderHistoryRow
              key={order.id}
              order={order}
              tableName={resolveTableName(order.tableId)}
              onOpen={setViewingOrder}
            />
          ))}
        </ul>
      )}

      {viewingOrder && (
        <OrderDetailDialog
          order={viewingOrder}
          tableName={resolveTableName(viewingOrder.tableId)}
          onClose={() => setViewingOrder(null)}
        />
      )}
    </div>
  );
}
