'use client';

import { MoreHorizontal, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DropdownMenuItem {
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  tone?: 'default' | 'danger';
  disabled?: boolean;
}

interface DropdownMenuProps {
  label: string;
  items: readonly DropdownMenuItem[];
  align?: 'start' | 'end';
  header?: ReactNode;
  trigger?: ReactNode;
  triggerClassName?: string;
}

const MENU_OFFSET_PX = 6;
const OPEN_UPWARD_THRESHOLD = 0.6;
const DEFAULT_TRIGGER_CLASS =
  'grid size-9 shrink-0 place-items-center rounded-lg text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none';

function isMenuOpen(menu: HTMLElement): boolean {
  return menu.matches(':popover-open');
}

/**
 * Menu "⋯" dựa trên Popover API nên tự đóng khi bấm ra ngoài hoặc nhấn Esc. Vị trí được tính từ
 * nút mở ngay trong sự kiện click, trước khi trình duyệt hiển thị popover, để không bị giật.
 */
export function DropdownMenu({
  label,
  items,
  align = 'end',
  header,
  trigger,
  triggerClassName = DEFAULT_TRIGGER_CLASS,
}: DropdownMenuProps) {
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) {
      return;
    }

    // Popover dùng vị trí cố định nên phải đóng lại khi trang cuộn hoặc đổi kích thước.
    function closeMenu(event: Event) {
      if (!menu || !isMenuOpen(menu)) {
        return;
      }
      if (event.target instanceof Node && menu.contains(event.target)) {
        return;
      }
      menu.hidePopover();
    }

    window.addEventListener('scroll', closeMenu, true);
    window.addEventListener('resize', closeMenu);
    return () => {
      window.removeEventListener('scroll', closeMenu, true);
      window.removeEventListener('resize', closeMenu);
    };
  }, []);

  function placeMenu() {
    const triggerElement = triggerRef.current;
    const menu = menuRef.current;
    if (!triggerElement || !menu) {
      return;
    }

    const rect = triggerElement.getBoundingClientRect();
    const opensUpward =
      rect.bottom > window.innerHeight * OPEN_UPWARD_THRESHOLD;

    if (opensUpward) {
      menu.style.top = 'auto';
      menu.style.bottom = `${window.innerHeight - rect.top + MENU_OFFSET_PX}px`;
    } else {
      menu.style.top = `${rect.bottom + MENU_OFFSET_PX}px`;
      menu.style.bottom = 'auto';
    }

    if (align === 'start') {
      menu.style.left = `${rect.left}px`;
      menu.style.right = 'auto';
    } else {
      menu.style.left = 'auto';
      menu.style.right = `${window.innerWidth - rect.right}px`;
    }
  }

  function handleSelect(item: DropdownMenuItem) {
    const menu = menuRef.current;
    if (menu && isMenuOpen(menu)) {
      menu.hidePopover();
    }
    item.onSelect();
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        popoverTarget={menuId}
        aria-label={label}
        title={label}
        onClick={placeMenu}
        className={triggerClassName}
      >
        {trigger ?? <MoreHorizontal className="size-5" />}
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        className="m-0 min-w-52 rounded-xl border border-line bg-surface p-1.5 text-ink shadow-overlay motion-safe:animate-fade-in"
      >
        {header && (
          <div className="mb-1 border-b border-line pb-1">{header}</div>
        )}
        <ul className="flex flex-col">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors disabled:opacity-50',
                    item.tone === 'danger'
                      ? 'text-danger hover:bg-danger-soft'
                      : 'text-ink hover:bg-surface-muted',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
