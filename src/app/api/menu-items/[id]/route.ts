import { menuItemInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  deleteMenuItem,
  updateMenuItem,
} from '@/server/repositories/menu-item-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('menu.manage');
  const { id } = await params;
  await updateMenuItem(id, await readJsonBody(request, menuItemInputSchema));
});

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('menu.manage');
  const { id } = await params;
  await deleteMenuItem(id);
});
