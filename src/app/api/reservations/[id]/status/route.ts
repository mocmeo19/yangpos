import { reservationStatusSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { setReservationStatus } from '@/server/repositories/reservation-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('pos.sell');
  const { id } = await params;
  const { status } = await readJsonBody(request, reservationStatusSchema);
  return setReservationStatus(id, status);
});
