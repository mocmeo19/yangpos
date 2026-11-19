import {
  BellRing,
  ChefHat,
  ConciergeBell,
  PackageCheck,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { isOrderPaid } from '@/lib/is-order-paid';
import type { ActiveOrderActions } from '@/types/active-order-actions';
import type { Order } from '@/types/order';

interface AdvanceAction {
  label: string;
  icon: LucideIcon;
}

function getAdvanceAction(order: Order): AdvanceAction | null {
  switch (order.status) {
    case 'pending':
      return { label: 'Bắt đầu làm', icon: ChefHat };
    case 'preparing':
      if (order.pagerNumber !== undefined) {
        return { label: `Xong, gọi thẻ ${order.pagerNumber}`, icon: BellRing };
      }
      return { label: 'Đã phục vụ', icon: ConciergeBell };
    default:
      return null;
  }
}

type TicketActions = Pick<
  ActiveOrderActions,
  'advance' | 'pay' | 'callPager' | 'completePickup'
>;

interface KitchenTicketActionsProps {
  order: Order;
  actions: TicketActions;
}

/**
 * Bếp còn làm: nút chuyển bước, kèm thu tiền nếu chưa thu. Món đã xong: thu tiền, hoặc với đơn có
 * thẻ rung đã trả trước thì chờ khách cầm thẻ tới nhận.
 */
export function KitchenTicketActions({
  order,
  actions,
}: KitchenTicketActionsProps) {
  const advanceAction = getAdvanceAction(order);
  const isPaid = isOrderPaid(order);
  const hasPager = order.pagerNumber !== undefined;
  const pay = isPaid ? null : actions.pay;

  if (advanceAction) {
    const AdvanceIcon = advanceAction.icon;
    return (
      <div className={cn('grid gap-2', pay && 'grid-cols-2')}>
        <Button variant="dark" onClick={() => actions.advance(order)}>
          <AdvanceIcon className="size-4" />
          {advanceAction.label}
        </Button>
        {pay && (
          <Button variant="secondary" onClick={() => pay(order)}>
            <Wallet className="size-4" />
            Thanh toán
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      className={cn('grid gap-2', hasPager && 'grid-cols-[auto_minmax(0,1fr)]')}
    >
      {hasPager && (
        <Button
          variant="secondary"
          title="Gọi lại thẻ rung"
          onClick={() => actions.callPager(order)}
        >
          <BellRing className="size-4" />
          Gọi lại
        </Button>
      )}
      {isPaid && (
        <Button onClick={() => actions.completePickup(order)}>
          <PackageCheck className="size-4" />
          Khách đã nhận
        </Button>
      )}
      {pay && (
        <Button onClick={() => pay(order)}>
          <Wallet className="size-4" />
          Thanh toán
        </Button>
      )}
    </div>
  );
}
