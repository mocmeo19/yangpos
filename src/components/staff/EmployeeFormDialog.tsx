'use client';

import { useState, type FormEvent } from 'react';
import { SettingsSwitchRow } from '@/components/settings/SettingsSwitchRow';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { getErrorMessage } from '@/lib/get-error-message';
import { MAX_PIN_LENGTH, MIN_PIN_LENGTH } from '@/lib/staff/pin-format';
import type { Employee, EmployeeInput, StaffRole } from '@/types/staff';

const FORM_ID = 'employee-form';

interface EmployeeFormDialogProps {
  employee?: Employee;
  /** Chỉ gồm các vai trò người đang thao tác được phép gán. */
  roles: readonly StaffRole[];
  /** Không cho tự ngừng hoạt động tài khoản đang dùng. */
  isSelf: boolean;
  onClose: () => void;
  onSubmit: (input: EmployeeInput) => Promise<void>;
}

function keepDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, MAX_PIN_LENGTH);
}

export function EmployeeFormDialog({
  employee,
  roles,
  isSelf,
  onClose,
  onSubmit,
}: EmployeeFormDialogProps) {
  const [name, setName] = useState(employee?.name ?? '');
  const [roleId, setRoleId] = useState(employee?.roleId ?? '');
  const [pin, setPin] = useState('');
  const [isActive, setIsActive] = useState(employee?.isActive ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = employee !== undefined;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!roleId) {
      setError('Vui lòng chọn vai trò.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, roleId, pin, isActive });
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Sửa nhân viên' : 'Thêm nhân viên'}
      size="sm"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting}>
            {isEditing ? 'Lưu thay đổi' : 'Thêm nhân viên'}
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <Field label="Họ tên" htmlFor="employee-name">
          <input
            id="employee-name"
            data-autofocus
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nguyễn Văn An"
            autoComplete="off"
            className={INPUT_CLASS_NAME}
          />
        </Field>
        <Field label="Vai trò" htmlFor="employee-role">
          <select
            id="employee-role"
            value={roleId}
            onChange={(event) => setRoleId(event.target.value)}
            className={INPUT_CLASS_NAME}
          >
            <option value="" disabled>
              Chọn vai trò
            </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={isEditing ? 'Mã PIN mới' : 'Mã PIN'}
          htmlFor="employee-pin"
          hint={
            isEditing
              ? 'Để trống nếu giữ nguyên PIN cũ.'
              : `${MIN_PIN_LENGTH}–${MAX_PIN_LENGTH} chữ số, dùng để mở khóa máy.`
          }
        >
          <input
            id="employee-pin"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={pin}
            onChange={(event) => setPin(keepDigits(event.target.value))}
            placeholder={isEditing ? '••••' : 'Nhập mã PIN'}
            className={cn(INPUT_CLASS_NAME, 'font-mono tracking-[0.4em]')}
          />
        </Field>
        {isEditing && (
          <SettingsSwitchRow
            label="Đang làm việc"
            description={
              isSelf
                ? 'Không thể tự ngừng hoạt động tài khoản đang dùng.'
                : 'Tắt để nhân viên nghỉ việc không mở khóa máy được nữa.'
            }
            checked={isActive}
            onChange={setIsActive}
            disabled={isSelf}
          />
        )}
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
