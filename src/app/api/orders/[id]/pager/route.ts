import { pagerSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  assignPager,
  markPagerCalled,
} from '@/server/repositories/order-repository';

/** Gắn, đổi hoặc gỡ (`pagerNumber: null`) thẻ rung của đơn mang đi. */
export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('pos.sell', 'orders.view');
  const { id } = await params;
  const { pagerNumber } = await readJsonBody(request, pagerSchema);
  await assignPager(id, pagerNumber);
});

/** Ghi nhận vừa gọi thẻ rung, để biết đơn đang chờ khách tới lấy. */
export const POST = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('pos.sell', 'orders.view');
  const { id } = await params;
  await markPagerCalled(id);
});
