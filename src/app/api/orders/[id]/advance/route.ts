import { apiRoute, type IdRouteContext } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { advanceKitchenStatus } from '@/server/repositories/order-repository';

export const POST = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('orders.view');
  const { id } = await params;
  await advanceKitchenStatus(id);
});
