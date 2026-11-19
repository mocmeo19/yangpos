import { nameSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import { requireShopSession, requireStaff } from '@/server/auth/require-staff';
import {
  addCategory,
  listCategories,
} from '@/server/repositories/category-repository';

export const GET = apiRoute(async () => {
  await requireShopSession();
  return listCategories();
});

export const POST = apiRoute(async (request) => {
  await requireStaff('menu.manage');
  const { name } = await readJsonBody(request, nameSchema);
  return addCategory(name);
});
