'use client';

import { ArrowLeftRight, ShieldX } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonClassName } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useStaffSession } from '@/hooks/use-staff-session';
import { useVisibleNavigationItems } from '@/hooks/use-visible-navigation-items';

export function AccessDenied({ pageLabel }: { pageLabel: string }) {
  const { session, lock } = useStaffSession();
  const [firstAllowedItem] = useVisibleNavigationItems();
  const roleName = session.status === 'unlocked' ? session.role.name : '';

  return (
    <EmptyState
      icon={ShieldX}
      title={`Bạn chưa được cấp quyền vào mục ${pageLabel}`}
      description={`Vai trò ${roleName} không có quyền này. Hãy nhờ chủ cửa hàng cấp quyền hoặc đổi sang nhân viên khác.`}
      action={
        <div className="flex flex-wrap justify-center gap-2">
          {firstAllowedItem && (
            <Link
              href={firstAllowedItem.href}
              className={buttonClassName({ size: 'sm' })}
            >
              Về {firstAllowedItem.label}
            </Link>
          )}
          <Button variant="secondary" size="sm" onClick={() => void lock()}>
            <ArrowLeftRight className="size-4" />
            Đổi nhân viên
          </Button>
        </div>
      }
    />
  );
}
