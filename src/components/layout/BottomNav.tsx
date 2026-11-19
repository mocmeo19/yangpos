'use client';

import { LayoutGrid, type LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useVisibleNavigationItems } from '@/hooks/use-visible-navigation-items';
import { cn } from '@/lib/cn';
import { isNavItemActive } from '@/lib/navigation/is-nav-item-active';
import { MobileMoreMenu } from './MobileMoreMenu';

// Thanh dưới chỉ đủ chỗ cho 5 ô dễ bấm; các mục còn lại nằm trong ô "Thêm".
const PRIMARY_ITEM_COUNT = 4;

const TAB_CLASS =
  'relative flex w-full flex-col items-center gap-1 pt-2.5 pb-2 text-[11px] font-semibold transition-colors';

interface TabContentProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

function TabContent({ icon: Icon, label, isActive }: TabContentProps) {
  return (
    <>
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute top-0 h-0.5 w-8 rounded-b-full bg-brand"
        />
      )}
      <Icon className="size-[22px]" strokeWidth={isActive ? 2.25 : 1.75} />
      {label}
    </>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const navigationItems = useVisibleNavigationItems();
  // Đủ chỗ thì hiện hết, khỏi phải mở thêm menu chỉ để thấy một mục.
  const hasMoreMenu = navigationItems.length > PRIMARY_ITEM_COUNT + 1;
  const primaryItems = hasMoreMenu
    ? navigationItems.slice(0, PRIMARY_ITEM_COUNT)
    : navigationItems;
  const moreItems = hasMoreMenu
    ? navigationItems.slice(PRIMARY_ITEM_COUNT)
    : [];
  const isMoreActive = moreItems.some((item) =>
    isNavItemActive(pathname, item.href),
  );

  return (
    <>
      <nav
        aria-label="Điều hướng chính"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto flex max-w-lg">
          {primaryItems.map(({ href, label, icon }) => {
            const isActive = isNavItemActive(pathname, href);
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    TAB_CLASS,
                    isActive ? 'text-brand' : 'text-ink-soft',
                  )}
                >
                  <TabContent icon={icon} label={label} isActive={isActive} />
                </Link>
              </li>
            );
          })}
          {hasMoreMenu && (
            <li className="flex-1">
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isMoreOpen}
                onClick={() => setIsMoreOpen(true)}
                className={cn(
                  TAB_CLASS,
                  isMoreActive ? 'text-brand' : 'text-ink-soft',
                )}
              >
                <TabContent
                  icon={LayoutGrid}
                  label="Thêm"
                  isActive={isMoreActive}
                />
              </button>
            </li>
          )}
        </ul>
      </nav>
      {isMoreOpen && (
        <MobileMoreMenu
          items={moreItems}
          pathname={pathname}
          onClose={() => setIsMoreOpen(false)}
        />
      )}
    </>
  );
}
