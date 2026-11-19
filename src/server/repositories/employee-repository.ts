import 'server-only';
import { OWNER_ROLE_ID } from '@/data/default-staff';
import { createId } from '@/lib/create-id';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { isOwnerRole } from '@/lib/staff/has-permission';
import { isDefaultOwnerPin } from '@/lib/staff/is-default-owner-pin';
import { createPinCredential } from '@/lib/staff/pin-credential';
import { assertPinFormat } from '@/lib/staff/pin-format';
import {
  getCollections,
  WITHOUT_MONGO_ID,
  type PosCollections,
} from '@/server/db/collections';
import type {
  Employee,
  EmployeeInput,
  EmployeeRecord,
  PinCredential,
  StaffActor,
} from '@/types/staff';

type EmployeeFields = Pick<EmployeeRecord, 'name' | 'roleId' | 'isActive'>;

/** Bỏ mã PIN đã băm trước khi gửi xuống trình duyệt. */
export function toPublicEmployee({
  pin,
  ...employee
}: EmployeeRecord): Employee {
  return {
    ...employee,
    usesDefaultPin: isOwnerRole(employee.roleId) && isDefaultOwnerPin(pin),
  };
}

function validateFields(input: EmployeeInput): EmployeeFields {
  const name = input.name.trim();
  if (!name) {
    throw new UserFacingError('Tên nhân viên không được để trống.');
  }
  return { name, roleId: input.roleId, isActive: input.isActive };
}

async function preparePin(pin: string): Promise<PinCredential> {
  try {
    assertPinFormat(pin);
  } catch (error) {
    throw new UserFacingError(
      error instanceof Error ? error.message : 'Mã PIN không hợp lệ.',
    );
  }
  return createPinCredential(pin);
}

async function assertRoleExists(
  collections: PosCollections,
  roleId: string,
): Promise<void> {
  if (!(await collections.staffRoles.countDocuments({ id: roleId }))) {
    throw new UserFacingError('Vai trò không tồn tại, vui lòng chọn lại.');
  }
}

/** Chỉ chủ cửa hàng mới được tạo, sửa hoặc xóa người giữ vai trò chủ cửa hàng. */
function assertCanTouchOwner(actor: StaffActor, roleIds: string[]): void {
  if (!isOwnerRole(actor.roleId) && roleIds.some(isOwnerRole)) {
    throw new UserFacingError(
      'Chỉ chủ cửa hàng mới thay đổi được tài khoản chủ cửa hàng.',
      403,
    );
  }
}

/** Luôn giữ ít nhất một chủ cửa hàng đang làm việc để máy không bị khóa vĩnh viễn. */
async function assertActiveOwnerRemains(
  collections: PosCollections,
  excludedId: string,
): Promise<void> {
  const remaining = await collections.employees.countDocuments({
    id: { $ne: excludedId },
    isActive: true,
    roleId: OWNER_ROLE_ID,
  });
  if (remaining === 0) {
    throw new UserFacingError(
      'Cửa hàng cần ít nhất một chủ cửa hàng đang làm việc.',
    );
  }
}

async function getEmployeeOrThrow(
  collections: PosCollections,
  id: string,
): Promise<EmployeeRecord> {
  const employee = await collections.employees.findOne<EmployeeRecord>(
    { id },
    WITHOUT_MONGO_ID,
  );
  if (!employee) {
    throw new UserFacingError('Không tìm thấy nhân viên.', 404);
  }
  return employee;
}

export async function listEmployees(): Promise<Employee[]> {
  const { employees } = await getCollections();
  const records = await employees
    .find<EmployeeRecord>({}, { ...WITHOUT_MONGO_ID, sort: { createdAt: 1 } })
    .toArray();
  return records.map(toPublicEmployee);
}

export async function findEmployeeRecord(
  id: string,
): Promise<EmployeeRecord | null> {
  const { employees } = await getCollections();
  return employees.findOne<EmployeeRecord>({ id }, WITHOUT_MONGO_ID);
}

export async function addEmployee(
  input: EmployeeInput,
  actor: StaffActor,
): Promise<Employee> {
  const fields = validateFields(input);
  assertCanTouchOwner(actor, [fields.roleId]);
  const pin = await preparePin(input.pin);
  const collections = await getCollections();

  await assertRoleExists(collections, fields.roleId);
  const employee: EmployeeRecord = {
    ...fields,
    id: createId(),
    pin,
    createdAt: Date.now(),
  };
  await collections.employees.insertOne({ ...employee });
  return toPublicEmployee(employee);
}

export async function updateEmployee(
  id: string,
  input: EmployeeInput,
  actor: StaffActor,
): Promise<void> {
  const fields = validateFields(input);
  const pin = input.pin ? await preparePin(input.pin) : null;
  if (id === actor.employeeId && !fields.isActive) {
    throw new UserFacingError(
      'Không thể tự ngừng hoạt động tài khoản đang dùng.',
    );
  }
  const collections = await getCollections();

  const current = await getEmployeeOrThrow(collections, id);
  assertCanTouchOwner(actor, [current.roleId, fields.roleId]);
  await assertRoleExists(collections, fields.roleId);
  const isLeavingOwnerRole =
    isOwnerRole(current.roleId) &&
    (!isOwnerRole(fields.roleId) || !fields.isActive);
  if (isLeavingOwnerRole) {
    await assertActiveOwnerRemains(collections, id);
  }
  await collections.employees.updateOne(
    { id },
    { $set: pin ? { ...fields, pin } : fields },
  );
}

export async function deleteEmployee(
  id: string,
  actor: StaffActor,
): Promise<void> {
  if (id === actor.employeeId) {
    throw new UserFacingError('Không thể xóa tài khoản đang dùng.');
  }
  const collections = await getCollections();

  const current = await getEmployeeOrThrow(collections, id);
  assertCanTouchOwner(actor, [current.roleId]);
  if (isOwnerRole(current.roleId)) {
    await assertActiveOwnerRemains(collections, id);
  }
  await collections.employees.deleteOne({ id });
}
