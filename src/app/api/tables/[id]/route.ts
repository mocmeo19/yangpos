import { diningTableInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  deleteDiningTable,
  updateDiningTable,
} from '@/server/repositories/dining-table-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('tables.manage');
  const { id } = await params;
  await updateDiningTable(
    id,
    await readJsonBody(request, diningTableInputSchema),
  );
});

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('tables.manage');
  const { id } = await params;
  await deleteDiningTable(id);
});
