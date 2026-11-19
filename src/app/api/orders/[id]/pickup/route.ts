import { apiRoute, type IdRouteContext } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { completePickup } from '@/server/repositories/order-repository';

export const POST = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('orders.view', 'orders.pay');
  const { id } = await params;
  await completePickup(id);
});
