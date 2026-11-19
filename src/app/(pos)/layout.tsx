import { Suspense } from 'react';
import { BottomNav } from '@/components/layout/BottomNav';
import { CurrentUserMenu } from '@/components/layout/CurrentUserMenu';
import { MobileTopBar } from '@/components/layout/MobileTopBar';
import { PosProviders } from '@/components/layout/PosProviders';
import { SideRail } from '@/components/layout/SideRail';
import { RoutePermissionGuard } from '@/components/staff/RoutePermissionGuard';
import { StaffGate } from '@/components/staff/StaffGate';

export default function PosLayout({ children }: LayoutProps<'/'>) {
  const avatarFallback = (
    <span aria-hidden="true" className="block size-10 rounded-full bg-ink/10" />
  );

  return (
    <PosProviders>
      <StaffGate>
        <SideRail
          userMenu={
            <Suspense fallback={avatarFallback}>
              <CurrentUserMenu align="start" />
            </Suspense>
          }
        />
        <MobileTopBar
          userMenu={
            <Suspense fallback={avatarFallback}>
              <CurrentUserMenu align="end" />
            </Suspense>
          }
        />
        <main className="px-4 pt-4 pb-36 sm:px-6 lg:ml-[88px] lg:px-8 lg:pt-6 lg:pb-8">
          <div className="mx-auto w-full max-w-[1600px]">
            <RoutePermissionGuard>{children}</RoutePermissionGuard>
          </div>
        </main>
        <BottomNav />
      </StaffGate>
    </PosProviders>
  );
}
