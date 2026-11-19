import { staffRoleInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import { requireShopSession, requireStaff } from '@/server/auth/require-staff';
import {
  addStaffRole,
  listStaffRoles,
} from '@/server/repositories/staff-role-repository';

// Màn hình khóa cần tên vai trò trước khi có nhân viên nào mở khóa.
export const GET = apiRoute(async () => {
  await requireShopSession();
  return listStaffRoles();
});

export const POST = apiRoute(async (request) => {
  await requireStaff('staff.manage');
  return addStaffRole(await readJsonBody(request, staffRoleInputSchema));
});
