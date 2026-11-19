'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { INPUT_CLASS_NAME } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import {
  addDays,
  parseDateInputValue,
  toDateInputValue,
} from '@/lib/day-range';

interface DayNavigatorProps {
  /** Ngày đang xem, dạng `YYYY-MM-DD`. */
  value: string;
  todayValue: string;
  onChange: (value: string) => void;
}

export function DayNavigator({
  value,
  todayValue,
  onChange,
}: DayNavigatorProps) {
  const shiftDay = (days: number) =>
    onChange(toDateInputValue(addDays(parseDateInputValue(value), days)));

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        size="icon"
        aria-label="Ngày trước"
        onClick={() => shiftDay(-1)}
      >
        <ChevronLeft className="size-5" />
      </Button>
      <input
        type="date"
        aria-label="Chọn ngày"
        value={value}
        onChange={(event) => {
          if (event.target.value) {
            onChange(event.target.value);
          }
        }}
        className={cn(INPUT_CLASS_NAME, 'w-auto')}
      />
      <Button
        variant="secondary"
        size="icon"
        aria-label="Ngày sau"
        onClick={() => shiftDay(1)}
      >
        <ChevronRight className="size-5" />
      </Button>
      <Button
        variant="ghost"
        disabled={value === todayValue}
        onClick={() => onChange(todayValue)}
      >
        Hôm nay
      </Button>
    </div>
  );
}
