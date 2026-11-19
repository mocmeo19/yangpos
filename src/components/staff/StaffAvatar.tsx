import { cn } from '@/lib/cn';
import { getStaffInitials } from '@/lib/staff/get-staff-initials';

type StaffAvatarSize = 'sm' | 'md' | 'lg';

const SIZE_CLASSES: Record<StaffAvatarSize, string> = {
  sm: 'size-10 text-sm',
  md: 'size-12 text-base',
  lg: 'size-16 text-xl',
};

interface StaffAvatarProps {
  name: string;
  size?: StaffAvatarSize;
  isMuted?: boolean;
}

export function StaffAvatar({
  name,
  size = 'md',
  isMuted = false,
}: StaffAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-full font-bold',
        SIZE_CLASSES[size],
        isMuted ? 'bg-ink/5 text-ink-faint' : 'bg-brand-soft text-brand-dark',
      )}
    >
      {getStaffInitials(name)}
    </span>
  );
}
