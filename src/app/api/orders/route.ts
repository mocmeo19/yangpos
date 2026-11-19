import type { NextRequest } from 'next/server';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { placeOrderSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  readNumberParam,
  readTimeRange,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  listActiveOrders,
  listClosedOrders,
  listPaidOrdersInRange,
  placeOrder,
  type ClosedOrderStatus,
} from '@/server/repositories/order-repository';

const MAX_CLOSED_ORDERS = 500;

function readClosedStatus(request: NextRequest): ClosedOrderStatus {
  const status = request.nextUrl.searchParams.get('status');
  if (status === 'paid' || status === 'cancelled') {
    return status;
  }
  throw new UserFacingError('Tham số status phải là paid hoặc cancelled.');
}

/** `?view=active` đơn đang xử lý, `?view=closed&status=&limit=` lịch sử, `?view=paid&start=&end=` đơn đã thu tiền trong kỳ. */
export const GET = apiRoute(async (request) => {
  const view = request.nextUrl.searchParams.get('view');
  switch (view) {
    case 'active':
      await requireStaff('pos.sell', 'orders.view');
      return listActiveOrders();
    case 'closed': {
      await requireStaff('orders.view');
      const limit = Math.min(
        readNumberParam(request, 'limit'),
        MAX_CLOSED_ORDERS,
      );
      return listClosedOrders(readClosedStatus(request), limit);
    }
    case 'paid':
      await requireStaff('reports.view', 'finance.manage');
      return listPaidOrdersInRange(readTimeRange(request));
    default:
      throw new UserFacingError('Tham số view không hợp lệ.');
  }
});

export const POST = apiRoute(async (request) => {
  await requireStaff('pos.sell');
  return placeOrder(await readJsonBody(request, placeOrderSchema));
});
