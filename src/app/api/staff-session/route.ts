import { unlockStaffSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import {
  getCurrentStaff,
  requireShopSession,
} from '@/server/auth/require-staff';
import { clearStaffSessionCookie } from '@/server/auth/staff-session-cookie';
import { unlockStaff } from '@/server/auth/unlock-staff';
import { toPublicEmployee } from '@/server/repositories/employee-repository';
import type { StaffSessionInfo } from '@/types/staff';

/** Nhân viên đang mở khóa máy; `null` khi máy đang khóa. */
export const GET = apiRoute(async (): Promise<StaffSessionInfo | null> => {
  await requireShopSession();
  const staff = await getCurrentStaff();
  if (!staff) {
    return null;
  }
  return { employee: toPublicEmployee(staff.employee), role: staff.role };
});

/** Mở khóa bằng mã PIN. */
export const POST = apiRoute(async (request) => {
  await requireShopSession();
  const { employeeId, pin } = await readJsonBody(request, unlockStaffSchema);
  await unlockStaff(employeeId, pin);
});

/** Khóa máy để nhân viên khác vào ca. */
export const DELETE = apiRoute(async () => {
  await clearStaffSessionCookie();
});
