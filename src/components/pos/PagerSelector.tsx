'use client';

import { ChevronRight, Vibrate, X } from 'lucide-react';
import { useState } from 'react';
import { PagerPickerDialog } from '@/components/pager/PagerPickerDialog';
import { Button } from '@/components/ui/Button';
import { formatPagerLabel } from '@/lib/pager/format-pager-label';
import type { Order } from '@/types/order';

interface PagerSelectorProps {
  pagerNumbers: readonly number[];
  pagersInUse: ReadonlyMap<number, Order>;
  value: number | null;
  onChange: (pagerNumber: number | null) => void;
}

/** Ô chọn thẻ rung trên phiếu gọi món, chỉ hiện khi bán mang đi hoặc tại quầy. */
export function PagerSelector({
  pagerNumbers,
  pagersInUse,
  value,
  onChange,
}: PagerSelectorProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  function handleSelect(pagerNumber: number | null) {
    onChange(pagerNumber);
    setIsPickerOpen(false);
  }

  return (
    <>
      {value === null && (
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          aria-haspopup="dialog"
          className="flex w-full items-center gap-3 rounded-xl border border-dashed border-line-strong bg-surface-muted px-3 py-2.5 text-left transition-colors hover:border-brand/50 hover:bg-brand-soft/40"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-ink-soft shadow-card">
            <Vibrate aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Thẻ rung</span>
            <span className="block text-xs text-ink-soft">
              Đưa khách thẻ để gọi khi món xong
            </span>
          </span>
          <span className="flex shrink-0 items-center text-sm font-semibold text-brand">
            Chọn thẻ
            <ChevronRight aria-hidden="true" className="size-4" />
          </span>
        </button>
      )}
      {value !== null && (
        <div className="flex items-center gap-2 rounded-xl border border-line bg-surface py-2 pr-2 pl-3 shadow-card">
          <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-ink font-mono text-lg font-bold text-white tabular-nums">
            {value}
          </span>
          <button
            type="button"
            onClick={() => setIsPickerOpen(true)}
            aria-haspopup="dialog"
            className="min-w-0 flex-1 rounded-md text-left focus-visible:ring-2 focus-visible:ring-brand/60 focus-visible:outline-none"
          >
            <span className="block truncate text-sm font-semibold">
              {formatPagerLabel(value)}
            </span>
            <span className="block text-xs text-brand">Đổi thẻ</span>
          </button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Bỏ thẻ rung"
            title="Bỏ thẻ rung"
            onClick={() => onChange(null)}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      {isPickerOpen && (
        <PagerPickerDialog
          pagerNumbers={pagerNumbers}
          pagersInUse={pagersInUse}
          value={value}
          onSelect={handleSelect}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </>
  );
}
