'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LoadingState } from '@/components/ui/LoadingState';
import { useConfirm } from '@/hooks/use-confirm';
import { useEmployees } from '@/hooks/use-employees';
import { useStaffRoles } from '@/hooks/use-staff-roles';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/get-error-message';
import { isOwnerRole } from '@/lib/staff/has-permission';
import {
  addEmployee,
  deleteEmployee,
  updateEmployee,
} from '@/api-client/employee-api';
import type { Employee, EmployeeInput, StaffActor } from '@/types/staff';
import { EmployeeFormDialog } from './EmployeeFormDialog';
import { EmployeeRow } from './EmployeeRow';

type EmployeeFormState =
  { mode: 'create' } | { mode: 'edit'; employee: Employee };

export function EmployeeManager({ actor }: { actor: StaffActor }) {
  const employees = useEmployees();
  const roles = useStaffRoles();
  const [formState, setFormState] = useState<EmployeeFormState | null>(null);
  const showToast = useToast();
  const confirm = useConfirm();

  if (!employees || !roles) {
    return <LoadingState />;
  }

  const isActorOwner = isOwnerRole(actor.roleId);
  const assignableRoles = isActorOwner
    ? roles
    : roles.filter((role) => !isOwnerRole(role.id));
  const resolveRoleName = (roleId: string) =>
    roles.find((role) => role.id === roleId)?.name ?? 'Chưa có vai trò';
  // Quản lý được cấp quyền nhân viên vẫn không đụng được tài khoản chủ cửa hàng.
  const canModify = (employee: Employee) =>
    isActorOwner || !isOwnerRole(employee.roleId);
  const activeCount = employees.filter((employee) => employee.isActive).length;

  async function handleSubmit(input: EmployeeInput) {
    if (formState?.mode === 'edit') {
      await updateEmployee(formState.employee.id, input);
      showToast({ title: `Đã cập nhật ${input.name.trim()}` });
    } else {
      await addEmployee(input);
      showToast({ title: `Đã thêm ${input.name.trim()}` });
    }
    setFormState(null);
  }

  async function handleDelete(employee: Employee) {
    const isConfirmed = await confirm({
      title: `Xóa ${employee.name}?`,
      description:
        'Nhân viên sẽ không mở khóa máy được nữa. Nếu chỉ tạm nghỉ, hãy tắt "Đang làm việc" thay vì xóa.',
      confirmLabel: 'Xóa nhân viên',
      tone: 'danger',
    });
    if (!isConfirmed) {
      return;
    }
    try {
      await deleteEmployee(employee.id);
      showToast({ title: `Đã xóa ${employee.name}` });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Không xóa được nhân viên',
        description: getErrorMessage(error),
      });
    }
  }

  const editingEmployee =
    formState?.mode === 'edit' ? formState.employee : undefined;

  return (
    <section aria-label="Danh sách nhân viên" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {activeCount}/{employees.length} nhân viên đang làm việc
        </p>
        <Button onClick={() => setFormState({ mode: 'create' })}>
          <Plus className="size-4" />
          Thêm nhân viên
        </Button>
      </div>

      <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {employees.map((employee) => {
          const isSelf = employee.id === actor.employeeId;
          const isModifiable = canModify(employee);
          return (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              roleName={resolveRoleName(employee.roleId)}
              isSelf={isSelf}
              usesDefaultPin={employee.usesDefaultPin}
              onEdit={
                isModifiable
                  ? (target) => setFormState({ mode: 'edit', employee: target })
                  : null
              }
              onDelete={
                isModifiable && !isSelf
                  ? (target) => void handleDelete(target)
                  : null
              }
            />
          );
        })}
      </ul>

      {formState && (
        <EmployeeFormDialog
          employee={editingEmployee}
          roles={assignableRoles}
          isSelf={editingEmployee?.id === actor.employeeId}
          onClose={() => setFormState(null)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
