'use client';

import { ArrowLeftRight, LogOut } from 'lucide-react';
import { useTransition } from 'react';
import { logout } from '@/actions/auth-actions';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { useStaffSession } from '@/hooks/use-staff-session';
import { getStaffInitials } from '@/lib/staff/get-staff-initials';

interface UserMenuProps {
  /** Tài khoản cửa hàng đăng nhập trên máy; nhân viên mở khóa bằng PIN sau bước này. */
  username: string;
  align: 'start' | 'end';
}

export function UserMenu({ username, align }: UserMenuProps) {
  const [isLoggingOut, startLogout] = useTransition();
  const { session, lock } = useStaffSession();
  const staff = session.status === 'unlocked' ? session : null;
  const displayName = staff?.employee.name ?? username;

  function handleLogout() {
    startLogout(async () => {
      await lock();
      await logout();
    });
  }

  return (
    <DropdownMenu
      label={`Tài khoản ${displayName}`}
      align={align}
      trigger={getStaffInitials(displayName)}
      triggerClassName="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white uppercase ring-line-strong ring-offset-2 ring-offset-surface transition hover:ring-2 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
      header={
        <div className="px-3 py-2">
          <p className="text-xs text-ink-soft">Đang làm việc</p>
          <p className="text-sm font-semibold">{displayName}</p>
          {staff && <p className="text-xs text-ink-soft">{staff.role.name}</p>}
          <p className="mt-1 text-xs text-ink-faint">
            Tài khoản cửa hàng: {username}
          </p>
        </div>
      }
      items={[
        {
          label: 'Đổi nhân viên',
          icon: ArrowLeftRight,
          onSelect: () => void lock(),
        },
        {
          label: isLoggingOut ? 'Đang đăng xuất…' : 'Đăng xuất',
          icon: LogOut,
          tone: 'danger',
          disabled: isLoggingOut,
          onSelect: handleLogout,
        },
      ]}
    />
  );
}
