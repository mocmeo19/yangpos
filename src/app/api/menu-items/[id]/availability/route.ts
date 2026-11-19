import { availabilitySchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { setMenuItemAvailability } from '@/server/repositories/menu-item-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('menu.manage');
  const { id } = await params;
  const { isAvailable } = await readJsonBody(request, availabilitySchema);
  await setMenuItemAvailability(id, isAvailable);
});
