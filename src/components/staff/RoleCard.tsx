import { Pencil, ShieldCheck, Trash2 } from 'lucide-react';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { PERMISSION_OPTIONS } from '@/data/permissions';
import { isOwnerRole } from '@/lib/staff/has-permission';
import type { StaffRole } from '@/types/staff';

interface RoleCardProps {
  role: StaffRole;
  employeeCount: number;
  onEdit: (role: StaffRole) => void;
  onDelete: (role: StaffRole) => void;
}

export function RoleCard({
  role,
  employeeCount,
  onEdit,
  onDelete,
}: RoleCardProps) {
  const isOwner = isOwnerRole(role.id);
  const permissionLabels = PERMISSION_OPTIONS.filter((option) =>
    role.permissions.includes(option.value),
  ).map((option) => option.label);

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 shadow-card">
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold tracking-tight">
            {role.name}
          </h3>
          <p className="text-xs text-ink-soft">{employeeCount} nhân viên</p>
        </div>
        {!isOwner && (
          <DropdownMenu
            label={`Thao tác vai trò ${role.name}`}
            items={[
              {
                label: 'Sửa quyền',
                icon: Pencil,
                onSelect: () => onEdit(role),
              },
              {
                label: 'Xóa vai trò',
                icon: Trash2,
                tone: 'danger',
                onSelect: () => onDelete(role),
              },
            ]}
          />
        )}
      </header>

      {isOwner && (
        <p className="flex items-center gap-2 rounded-xl bg-success-soft px-3 py-2 text-sm font-semibold text-success">
          <ShieldCheck aria-hidden="true" className="size-4 shrink-0" />
          Toàn quyền, không thể thay đổi
        </p>
      )}
      {!isOwner && permissionLabels.length === 0 && (
        <p className="text-sm text-ink-faint">Chưa được cấp quyền nào</p>
      )}
      {!isOwner && permissionLabels.length > 0 && (
        <ul
          aria-label={`Quyền của ${role.name}`}
          className="flex flex-wrap gap-1.5"
        >
          {permissionLabels.map((label) => (
            <li
              key={label}
              className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink-soft"
            >
              {label}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
