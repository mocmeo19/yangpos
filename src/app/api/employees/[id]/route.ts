import { employeeInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  deleteEmployee,
  updateEmployee,
} from '@/server/repositories/employee-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  const { actor } = await requireStaff('staff.manage');
  const { id } = await params;
  await updateEmployee(
    id,
    await readJsonBody(request, employeeInputSchema),
    actor,
  );
});

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  const { actor } = await requireStaff('staff.manage');
  const { id } = await params;
  await deleteEmployee(id, actor);
});
