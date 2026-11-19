import { Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import type { Employee } from '@/types/staff';
import { StaffAvatar } from './StaffAvatar';

interface EmployeeRowProps {
  employee: Employee;
  roleName: string;
  isSelf: boolean;
  usesDefaultPin: boolean;
  /** `null` khi người đang thao tác không được sửa nhân viên này (vd chủ cửa hàng). */
  onEdit: ((employee: Employee) => void) | null;
  onDelete: ((employee: Employee) => void) | null;
}

const BADGE_CLASS = 'rounded-full px-2 py-0.5 text-[11px] font-semibold';

export function EmployeeRow({
  employee,
  roleName,
  isSelf,
  usesDefaultPin,
  onEdit,
  onDelete,
}: EmployeeRowProps) {
  const menuItems: DropdownMenuItem[] = [];
  if (onEdit) {
    menuItems.push({
      label: 'Sửa, đổi PIN',
      icon: Pencil,
      onSelect: () => onEdit(employee),
    });
  }
  if (onDelete) {
    menuItems.push({
      label: 'Xóa nhân viên',
      icon: Trash2,
      tone: 'danger',
      onSelect: () => onDelete(employee),
    });
  }

  return (
    <li className="flex items-center gap-3 px-3 py-3 sm:px-4">
      <button
        type="button"
        disabled={!onEdit}
        onClick={() => onEdit?.(employee)}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left disabled:cursor-default"
      >
        <StaffAvatar
          name={employee.name}
          size="sm"
          isMuted={!employee.isActive}
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5">
            <span className="truncate font-semibold">{employee.name}</span>
            {isSelf && (
              <span className={`${BADGE_CLASS} bg-brand-soft text-brand-dark`}>
                Bạn
              </span>
            )}
            {!employee.isActive && (
              <span className={`${BADGE_CLASS} bg-ink/5 text-ink-soft`}>
                Đã nghỉ
              </span>
            )}
            {usesDefaultPin && (
              <span className={`${BADGE_CLASS} bg-warning-soft text-warning`}>
                PIN mặc định
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-ink-soft">
            {roleName}
          </span>
        </span>
      </button>
      {menuItems.length > 0 && (
        <DropdownMenu label={`Thao tác ${employee.name}`} items={menuItems} />
      )}
    </li>
  );
}
