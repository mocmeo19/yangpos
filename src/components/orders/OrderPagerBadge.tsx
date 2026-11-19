import { Vibrate } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatTime } from '@/lib/format-time';
import type { Order } from '@/types/order';

/** Số thẻ rung trên phiếu bếp; đã gọi thì kèm giờ gọi để biết khách đang được chờ bao lâu. */
export function OrderPagerBadge({ order }: { order: Order }) {
  if (order.pagerNumber === undefined) {
    return null;
  }
  const isCalled = order.pagerCalledAt !== undefined;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold whitespace-nowrap',
        isCalled ? 'bg-brand text-white' : 'bg-ink/5 text-ink',
      )}
    >
      <Vibrate aria-hidden="true" className="size-3.5" />
      Thẻ {order.pagerNumber}
      {order.pagerCalledAt !== undefined && (
        <span className="font-normal opacity-80">
          · gọi {formatTime(order.pagerCalledAt)}
        </span>
      )}
    </span>
  );
}
