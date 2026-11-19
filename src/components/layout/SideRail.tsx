'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { BrandMark } from '@/components/ui/BrandMark';
import { useVisibleNavigationItems } from '@/hooks/use-visible-navigation-items';
import { cn } from '@/lib/cn';
import { isNavItemActive } from '@/lib/navigation/is-nav-item-active';

export function SideRail({ userMenu }: { userMenu: ReactNode }) {
  const pathname = usePathname();
  const navigationItems = useVisibleNavigationItems();

  return (
    <nav
      aria-label="Điều hướng chính"
      className="fixed inset-y-0 left-0 z-40 hidden w-[88px] flex-col items-center border-r border-line bg-surface py-4 lg:flex"
    >
      <Link href="/" aria-label="YangPOS - Bán hàng" className="mb-6">
        <BrandMark />
      </Link>
      <ul className="flex w-full flex-1 flex-col gap-1 px-2.5">
        {navigationItems.map(({ href, label, icon: Icon }) => {
          const isActive = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'relative flex flex-col items-center gap-1 rounded-xl py-2.5 text-[11px] font-semibold transition-colors',
                  isActive
                    ? 'bg-brand-soft text-brand'
                    : 'text-ink-soft hover:bg-surface-muted hover:text-ink',
                )}
              >
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 -left-2.5 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand"
                  />
                )}
                <Icon
                  className="size-[22px]"
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
      {userMenu}
    </nav>
  );
}
