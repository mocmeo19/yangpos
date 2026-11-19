import type { Employee } from '@/types/staff';
import { StaffAvatar } from './StaffAvatar';

interface EmployeePickerProps {
  employees: readonly Employee[];
  resolveRoleName: (roleId: string) => string;
  onSelect: (employee: Employee) => void;
}

export function EmployeePicker({
  employees,
  resolveRoleName,
  onSelect,
}: EmployeePickerProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {employees.map((employee) => (
        <li key={employee.id}>
          <button
            type="button"
            onClick={() => onSelect(employee)}
            className="flex w-full flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-4 text-center shadow-card transition-colors hover:border-brand/40 hover:bg-brand-soft/40 focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
          >
            <StaffAvatar name={employee.name} />
            <span className="w-full min-w-0">
              <span className="block truncate text-sm font-semibold">
                {employee.name}
              </span>
              <span className="block truncate text-xs text-ink-soft">
                {resolveRoleName(employee.roleId)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
