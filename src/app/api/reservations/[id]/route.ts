import { reservationInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { updateReservation } from '@/server/repositories/reservation-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('pos.sell');
  const { id } = await params;
  await updateReservation(
    id,
    await readJsonBody(request, reservationInputSchema),
  );
});
