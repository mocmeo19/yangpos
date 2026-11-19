'use client';

import { ChefHat, History, Plus } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { PagerPickerDialog } from '@/components/pager/PagerPickerDialog';
import { buttonClassName } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { useActiveOrders } from '@/hooks/use-active-orders';
import { useCompletePayment } from '@/hooks/use-complete-payment';
import { useConfirm } from '@/hooks/use-confirm';
import { useOpenTableInPos } from '@/hooks/use-open-table-in-pos';
import { usePagerCaller } from '@/hooks/use-pager-caller';
import { usePrintOrderReceipt } from '@/hooks/use-print-order-receipt';
import { useSettings } from '@/hooks/use-settings';
import { useStaffSession } from '@/hooks/use-staff-session';
import { useTableNameResolver } from '@/hooks/use-table-name-resolver';
import { useToast } from '@/hooks/use-toast';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { getNextKitchenStatus, ORDER_STATUS_LABELS } from '@/lib/order-status';
import { groupPagersInUse } from '@/lib/pager/group-pagers-in-use';
import { listPagerNumbers } from '@/lib/pager/list-pager-numbers';
import {
  advanceKitchenStatus,
  assignPager,
  cancelOrder,
  completePickup,
} from '@/api-client/order-api';
import type { ActiveOrderActions } from '@/types/active-order-actions';
import type { CheckoutInput } from '@/types/checkout';
import type { Order } from '@/types/order';
import { ActiveOrdersView } from './ActiveOrdersView';
import { OrderHistoryView } from './OrderHistoryView';
import { PaymentDialog } from './PaymentDialog';

type OrdersView = 'active' | 'history';

export function OrdersBoard() {
  const [view, setView] = useState<OrdersView>('active');
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [pagerOrder, setPagerOrder] = useState<Order | null>(null);
  const activeOrders = useActiveOrders();
  const { settings } = useSettings();
  const resolveTableName = useTableNameResolver();
  const showToast = useToast();
  const confirm = useConfirm();
  const openTableInPos = useOpenTableInPos();
  const completePayment = useCompletePayment();
  const printOrderReceipt = usePrintOrderReceipt();
  const callPager = usePagerCaller();
  const { can } = useStaffSession();
  const pagersInUse = useMemo(
    () => groupPagersInUse(activeOrders ?? []),
    [activeOrders],
  );
  const isPagerEnabled = settings.pager.enabled;

  /** `successTitle` là `null` khi thao tác tiếp theo đã có thông báo riêng (vd gọi thẻ rung). */
  async function runAction(
    action: () => Promise<void>,
    successTitle: string | null,
  ): Promise<boolean> {
    try {
      await action();
      if (successTitle) {
        showToast({ title: successTitle });
      }
      return true;
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Thao tác chưa thành công',
        description: getErrorMessage(error),
      });
      return false;
    }
  }

  async function handleAdvance(order: Order) {
    const nextStatus = getNextKitchenStatus(order.status);
    if (!nextStatus) {
      return;
    }
    // Món xong thì gọi khách ngay: đế bấm tay luôn được nhắc số, đế nối USB tự gọi nếu bật.
    const callsPager =
      isPagerEnabled &&
      nextStatus === 'served' &&
      order.pagerNumber !== undefined &&
      (settings.pager.connection === 'manual' ||
        settings.pager.autoCallWhenReady);
    const isDone = await runAction(
      () => advanceKitchenStatus(order.id),
      callsPager
        ? null
        : `${formatOrderNumber(order.number)} · ${ORDER_STATUS_LABELS[nextStatus]}`,
    );
    if (isDone && callsPager) {
      await callPager(order);
    }
  }

  async function handleCancel(order: Order) {
    const label = formatOrderNumber(order.number);
    const isConfirmed = await confirm({
      title: `Hủy đơn ${label}?`,
      description: `${resolveTableName(order.tableId)} · đơn sẽ được chuyển vào lịch sử với trạng thái đã hủy.`,
      confirmLabel: 'Hủy đơn',
      cancelLabel: 'Giữ đơn',
      tone: 'danger',
    });
    if (isConfirmed) {
      await runAction(() => cancelOrder(order.id), `Đã hủy đơn ${label}`);
    }
  }

  async function handlePay(checkout: CheckoutInput) {
    if (!payingOrder) {
      return;
    }
    await completePayment(payingOrder, checkout);
    setPayingOrder(null);
  }

  function handleAddItems(order: Order) {
    if (order.tableId) {
      openTableInPos(order.tableId);
    }
  }

  async function handleAssignPager(pagerNumber: number | null) {
    if (!pagerOrder) {
      return;
    }
    const orderLabel = formatOrderNumber(pagerOrder.number);
    const isDone = await runAction(
      () => assignPager(pagerOrder.id, pagerNumber),
      pagerNumber === null
        ? `Đã bỏ thẻ rung của đơn ${orderLabel}`
        : `Đã gắn thẻ ${pagerNumber} cho đơn ${orderLabel}`,
    );
    if (isDone) {
      setPagerOrder(null);
    }
  }

  const actions: ActiveOrderActions = {
    advance: (order) => void handleAdvance(order),
    pay: can('orders.pay') ? setPayingOrder : null,
    printBill: (order) => void printOrderReceipt(order, 'provisional'),
    printReceipt: (order) => void printOrderReceipt(order, 'final'),
    cancel: can('orders.cancel') ? (order) => void handleCancel(order) : null,
    addItems: handleAddItems,
    callPager: (order) => void callPager(order),
    completePickup: (order) =>
      void runAction(
        () => completePickup(order.id),
        `${formatOrderNumber(order.number)} · Khách đã nhận món`,
      ),
    assignPager: setPagerOrder,
  };

  return (
    <>
      <PageHeader
        title="Đơn hàng"
        description="Theo dõi bếp, thanh toán và xem lại lịch sử đơn."
        actions={
          can('pos.sell') && (
            <Link href="/" className={buttonClassName()}>
              <Plus className="size-4" />
              Tạo đơn
            </Link>
          )
        }
      />
      <SegmentedControl
        label="Chế độ xem đơn"
        className="mb-5 max-w-sm"
        options={[
          {
            value: 'active',
            label: 'Đang xử lý',
            icon: ChefHat,
            badge: activeOrders?.length,
          },
          { value: 'history', label: 'Lịch sử', icon: History },
        ]}
        value={view}
        onChange={setView}
      />

      {view === 'active' && !activeOrders && <LoadingState />}
      {view === 'active' && activeOrders && (
        <ActiveOrdersView
          orders={activeOrders}
          actions={actions}
          isPagerEnabled={isPagerEnabled}
        />
      )}
      {view === 'history' && <OrderHistoryView />}

      {payingOrder && (
        <PaymentDialog
          order={payingOrder}
          tableName={resolveTableName(payingOrder.tableId)}
          onClose={() => setPayingOrder(null)}
          onConfirm={handlePay}
        />
      )}
      {pagerOrder && (
        <PagerPickerDialog
          pagerNumbers={listPagerNumbers(settings.pager)}
          pagersInUse={pagersInUse}
          value={pagerOrder.pagerNumber ?? null}
          currentOrderId={pagerOrder.id}
          onSelect={(pagerNumber) => void handleAssignPager(pagerNumber)}
          onClose={() => setPagerOrder(null)}
        />
      )}
    </>
  );
}
