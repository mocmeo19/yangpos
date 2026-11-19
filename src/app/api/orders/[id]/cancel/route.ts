import { apiRoute, type IdRouteContext } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { cancelOrder } from '@/server/repositories/order-repository';

export const POST = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('orders.cancel');
  const { id } = await params;
  await cancelOrder(id);
});
