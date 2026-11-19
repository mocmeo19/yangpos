import { diningTableInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import { requireShopSession, requireStaff } from '@/server/auth/require-staff';
import {
  addDiningTable,
  listDiningTables,
} from '@/server/repositories/dining-table-repository';

export const GET = apiRoute(async () => {
  await requireShopSession();
  return listDiningTables();
});

export const POST = apiRoute(async (request) => {
  await requireStaff('tables.manage');
  return addDiningTable(await readJsonBody(request, diningTableInputSchema));
});
