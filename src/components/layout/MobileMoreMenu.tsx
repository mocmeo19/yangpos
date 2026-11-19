'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/cn';
import { isNavItemActive } from '@/lib/navigation/is-nav-item-active';
import type { NavigationItem } from '@/types/navigation';

interface MobileMoreMenuProps {
  items: readonly NavigationItem[];
  pathname: string;
  onClose: () => void;
}

/** Các mục không vừa thanh điều hướng dưới cùng trên điện thoại. */
export function MobileMoreMenu({
  items,
  pathname,
  onClose,
}: MobileMoreMenuProps) {
  return (
    <Modal title="Chức năng khác" size="sm" onClose={onClose}>
      <ul className="flex flex-col gap-1">
        {items.map(({ href, label, description, icon: Icon }) => {
          const isActive = isNavItemActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors',
                  isActive ? 'bg-brand-soft' : 'hover:bg-surface-muted',
                )}
              >
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-xl',
                    isActive ? 'bg-brand text-white' : 'bg-ink/5 text-ink-soft',
                  )}
                >
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block font-semibold',
                      isActive && 'text-brand-dark',
                    )}
                  >
                    {label}
                  </span>
                  <span className="block truncate text-xs text-ink-soft">
                    {description}
                  </span>
                </span>
                <ChevronRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-ink-faint"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
