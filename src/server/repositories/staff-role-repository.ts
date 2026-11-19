import 'server-only';
import { ALL_PERMISSIONS } from '@/data/permissions';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { isOwnerRole } from '@/lib/staff/has-permission';
import { getCollections, WITHOUT_MONGO_ID } from '@/server/db/collections';
import type { StaffRole, StaffRoleInput } from '@/types/staff';

function validateRole(input: StaffRoleInput): StaffRoleInput {
  const name = input.name.trim();
  if (!name) {
    throw new UserFacingError('Tên vai trò không được để trống.');
  }
  // Giữ thứ tự chuẩn và bỏ quyền lạ để dữ liệu không phụ thuộc thứ tự người dùng bấm chọn.
  const permissions = ALL_PERMISSIONS.filter((permission) =>
    input.permissions.includes(permission),
  );
  return { name, permissions };
}

function assertEditable(id: string): void {
  if (isOwnerRole(id)) {
    throw new UserFacingError(
      'Vai trò Chủ cửa hàng luôn có toàn quyền, không thể sửa.',
    );
  }
}

export async function listStaffRoles(): Promise<StaffRole[]> {
  const { staffRoles } = await getCollections();
  return staffRoles
    .find<StaffRole>({}, { ...WITHOUT_MONGO_ID, sort: { sortOrder: 1 } })
    .toArray();
}

export async function findStaffRole(id: string): Promise<StaffRole | null> {
  const { staffRoles } = await getCollections();
  return staffRoles.findOne<StaffRole>({ id }, WITHOUT_MONGO_ID);
}

export async function addStaffRole(input: StaffRoleInput): Promise<StaffRole> {
  const validInput = validateRole(input);
  const collections = await getCollections();
  const last = await collections.staffRoles.findOne<StaffRole>(
    {},
    { ...WITHOUT_MONGO_ID, sort: { sortOrder: -1 } },
  );
  const role: StaffRole = {
    ...validInput,
    id: createId(),
    sortOrder: (last?.sortOrder ?? -1) + 1,
  };
  await collections.staffRoles.insertOne({ ...role });
  return role;
}

export async function updateStaffRole(
  id: string,
  input: StaffRoleInput,
): Promise<void> {
  assertEditable(id);
  const { staffRoles } = await getCollections();
  await staffRoles.updateOne({ id }, { $set: validateRole(input) });
}

export async function deleteStaffRole(id: string): Promise<void> {
  assertEditable(id);
  const collections = await getCollections();
  const employeeCount = await collections.employees.countDocuments({
    roleId: id,
  });
  if (employeeCount > 0) {
    throw new UserFacingError(
      `Còn ${employeeCount} nhân viên giữ vai trò này. Hãy đổi vai trò của họ trước.`,
    );
  }
  await collections.staffRoles.deleteOne({ id });
}
