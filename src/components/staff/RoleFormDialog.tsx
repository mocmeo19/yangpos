'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { getErrorMessage } from '@/lib/get-error-message';
import type { Permission, StaffRole, StaffRoleInput } from '@/types/staff';
import { PermissionChecklist } from './PermissionChecklist';

const FORM_ID = 'staff-role-form';

interface RoleFormDialogProps {
  role?: StaffRole;
  onClose: () => void;
  onSubmit: (input: StaffRoleInput) => Promise<void>;
}

export function RoleFormDialog({
  role,
  onClose,
  onSubmit,
}: RoleFormDialogProps) {
  const [name, setName] = useState(role?.name ?? '');
  const [permissions, setPermissions] = useState<Permission[]>(
    role?.permissions ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, permissions });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={role ? 'Sửa vai trò' : 'Thêm vai trò'}
      description="Chọn những việc nhân viên giữ vai trò này được phép làm."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {role ? 'Lưu thay đổi' : 'Thêm vai trò'}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <Field label="Tên vai trò" htmlFor="staff-role-name">
          <input
            id="staff-role-name"
            data-autofocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Thu ngân ca tối, Pha chế…"
            className={INPUT_CLASS_NAME}
          />
        </Field>
        <PermissionChecklist value={permissions} onChange={setPermissions} />
        {error && (
          <p
            role="alert"
            className="rounded-xl bg-danger-soft px-3 py-2.5 text-sm text-danger"
          >
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
