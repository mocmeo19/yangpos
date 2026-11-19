import { Switch } from '@/components/ui/Switch';

interface SettingsSwitchRowProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function SettingsSwitchRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: SettingsSwitchRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface-muted px-4 py-3 has-[:disabled]:opacity-60">
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-xs text-ink-soft">{description}</p>}
      </div>
      <Switch
        checked={checked}
        label={label}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
}
