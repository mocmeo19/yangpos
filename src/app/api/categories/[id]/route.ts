import { nameSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  deleteCategory,
  renameCategory,
} from '@/server/repositories/category-repository';

export const PATCH = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('menu.manage');
  const { id } = await params;
  const { name } = await readJsonBody(request, nameSchema);
  await renameCategory(id, name);
});

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('menu.manage');
  const { id } = await params;
  await deleteCategory(id);
});
