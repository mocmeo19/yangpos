import { paymentInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { payOrder } from '@/server/repositories/order-repository';

export const POST = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('orders.pay');
  const { id } = await params;
  return payOrder(id, await readJsonBody(request, paymentInputSchema));
});
