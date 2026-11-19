import 'server-only';
import { getCurrentUsername } from '@/lib/auth/current-user';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { hasPermission } from '@/lib/staff/has-permission';
import { findEmployeeRecord } from '@/server/repositories/employee-repository';
import { findStaffRole } from '@/server/repositories/staff-role-repository';
import type {
  EmployeeRecord,
  Permission,
  StaffActor,
  StaffRole,
} from '@/types/staff';
import { readStaffSessionEmployeeId } from './staff-session-cookie';

export interface StaffContext {
  employee: EmployeeRecord;
  role: StaffRole;
  actor: StaffActor;
}

/** Máy đã đăng nhập tài khoản cửa hàng; đủ để đọc dữ liệu dùng chung như thực đơn, bàn. */
export async function requireShopSession(): Promise<void> {
  if (!(await getCurrentUsername())) {
    throw new UserFacingError(
      'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.',
      401,
    );
  }
}

/** Nhân viên đang mở khóa máy, đọc lại từ database để vai trò hay trạng thái mới có hiệu lực ngay. */
export async function getCurrentStaff(): Promise<StaffContext | null> {
  const employeeId = await readStaffSessionEmployeeId();
  if (!employeeId) {
    return null;
  }
  const employee = await findEmployeeRecord(employeeId);
  if (!employee || !employee.isActive) {
    return null;
  }
  const role = await findStaffRole(employee.roleId);
  if (!role) {
    return null;
  }
  return {
    employee,
    role,
    actor: { employeeId: employee.id, roleId: employee.roleId },
  };
}

/** Cần nhân viên đã mở khóa và có ít nhất một trong các quyền (bỏ trống: chỉ cần đã mở khóa). */
export async function requireStaff(
  ...anyOf: Permission[]
): Promise<StaffContext> {
  await requireShopSession();
  const staff = await getCurrentStaff();
  if (!staff) {
    throw new UserFacingError('Vui lòng mở khóa máy bằng mã PIN.', 401);
  }
  const isAllowed =
    anyOf.length === 0 ||
    anyOf.some((permission) => hasPermission(staff.role, permission));
  if (!isAllowed) {
    throw new UserFacingError(
      `Vai trò ${staff.role.name} không có quyền thực hiện thao tác này.`,
      403,
    );
  }
  return staff;
}
