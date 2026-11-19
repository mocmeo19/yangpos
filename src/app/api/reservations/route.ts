import { reservationInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody, readTimeRange } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  addReservation,
  listReservationsInRange,
} from '@/server/repositories/reservation-repository';

export const GET = apiRoute(async (request) => {
  await requireStaff('pos.sell');
  return listReservationsInRange(readTimeRange(request));
});

export const POST = apiRoute(async (request) => {
  await requireStaff('pos.sell');
  return addReservation(await readJsonBody(request, reservationInputSchema));
});
