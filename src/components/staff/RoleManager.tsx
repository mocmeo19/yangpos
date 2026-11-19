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
import {
  addStaffRole,
  deleteStaffRole,
  updateStaffRole,
} from '@/api-client/staff-role-api';
import type { StaffRole, StaffRoleInput } from '@/types/staff';
import { RoleCard } from './RoleCard';
import { RoleFormDialog } from './RoleFormDialog';

type RoleFormState = { mode: 'create' } | { mode: 'edit'; role: StaffRole };

export function RoleManager() {
  const roles = useStaffRoles();
  const employees = useEmployees();
  const [formState, setFormState] = useState<RoleFormState | null>(null);
  const showToast = useToast();
  const confirm = useConfirm();

  if (!roles || !employees) {
    return <LoadingState />;
  }

  const countEmployees = (roleId: string) =>
    employees.filter((employee) => employee.roleId === roleId).length;

  async function handleSubmit(input: StaffRoleInput) {
    if (formState?.mode === 'edit') {
      await updateStaffRole(formState.role.id, input);
      showToast({ title: `Đã cập nhật vai trò ${input.name.trim()}` });
    } else {
      await addStaffRole(input);
      showToast({ title: `Đã thêm vai trò ${input.name.trim()}` });
    }
    setFormState(null);
  }

  async function handleDelete(role: StaffRole) {
    const isConfirmed = await confirm({
      title: `Xóa vai trò ${role.name}?`,
      description: 'Vai trò sẽ không còn để chọn khi thêm nhân viên.',
      confirmLabel: 'Xóa vai trò',
      tone: 'danger',
    });
    if (!isConfirmed) {
      return;
    }
    try {
      await deleteStaffRole(role.id);
      showToast({ title: `Đã xóa vai trò ${role.name}` });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Không xóa được vai trò',
        description: getErrorMessage(error),
      });
    }
  }

  return (
    <section aria-label="Vai trò" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          Mỗi nhân viên giữ một vai trò; quyền thay đổi có hiệu lực ngay.
        </p>
        <Button onClick={() => setFormState({ mode: 'create' })}>
          <Plus className="size-4" />
          Thêm vai trò
        </Button>
      </div>

      <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            employeeCount={countEmployees(role.id)}
            onEdit={(target) => setFormState({ mode: 'edit', role: target })}
            onDelete={(target) => void handleDelete(target)}
          />
        ))}
      </div>

      {formState && (
        <RoleFormDialog
          role={formState.mode === 'edit' ? formState.role : undefined}
          onClose={() => setFormState(null)}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}
