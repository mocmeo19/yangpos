import { staffRoleInputSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  deleteStaffRole,
  updateStaffRole,
} from '@/server/repositories/staff-role-repository';

export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('staff.manage');
  const { id } = await params;
  await updateStaffRole(id, await readJsonBody(request, staffRoleInputSchema));
});

export const DELETE = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff('staff.manage');
  const { id } = await params;
  await deleteStaffRole(id);
});
