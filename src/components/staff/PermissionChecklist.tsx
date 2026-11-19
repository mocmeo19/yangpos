import { PERMISSION_GROUPS } from '@/data/permissions';
import { cn } from '@/lib/cn';
import type { Permission } from '@/types/staff';

interface PermissionChecklistProps {
  value: readonly Permission[];
  onChange: (permissions: Permission[]) => void;
}

export function PermissionChecklist({
  value,
  onChange,
}: PermissionChecklistProps) {
  function toggle(permission: Permission, isChecked: boolean) {
    if (isChecked) {
      onChange([...value, permission]);
    } else {
      onChange(value.filter((item) => item !== permission));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {PERMISSION_GROUPS.map((group) => (
        <fieldset key={group.title} className="flex flex-col gap-2">
          <legend className="mb-2 text-sm font-semibold">{group.title}</legend>
          {group.permissions.map((option) => {
            const isChecked = value.includes(option.value);
            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/60',
                  isChecked
                    ? 'border-brand/40 bg-brand-soft/50'
                    : 'border-line bg-surface hover:border-line-strong',
                )}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(event) =>
                    toggle(option.value, event.target.checked)
                  }
                  className="mt-0.5 size-4 shrink-0 accent-brand"
                />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {option.label}
                  </span>
                  <span className="block text-xs text-ink-soft">
                    {option.description}
                  </span>
                </span>
              </label>
            );
          })}
        </fieldset>
      ))}
    </div>
  );
}
