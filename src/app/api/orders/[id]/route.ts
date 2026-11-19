import { UserFacingError } from '@/lib/errors/user-facing-error';
import { apiRoute, type IdRouteContext } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { findOrder } from '@/server/repositories/order-repository';

export const GET = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff();
  const { id } = await params;
  const order = await findOrder(id);
  if (!order) {
    throw new UserFacingError('Không tìm thấy đơn hàng.', 404);
  }
  return order;
});
