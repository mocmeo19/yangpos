import { apiRoute, type IdRouteContext } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { deleteCashEntry } from '@/server/repositories/cash-entry-repository';

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('finance.manage');
  const { id } = await params;
  await deleteCashEntry(id);
});
