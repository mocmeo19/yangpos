'use client';

import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { INPUT_CLASS_NAME } from '@/components/ui/Field';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { cn } from '@/lib/cn';
import type {
  FinancePeriodSelection,
  FinancePreset,
} from '@/types/finance-period';

/** "custom" không có ô riêng; khi chọn khoảng ngày thì không ô nào sáng. */
type PresetValue = FinancePreset | 'custom';

const PRESET_OPTIONS: readonly SegmentedOption<PresetValue>[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'thisMonth', label: 'Tháng này' },
  { value: 'lastMonth', label: 'Tháng trước' },
];

interface FinancePeriodPickerProps {
  selection: FinancePeriodSelection;
  maxDate: string;
  onChange: (selection: FinancePeriodSelection) => void;
}

function toMonthStart(dateValue: string): string {
  return `${dateValue.slice(0, 8)}01`;
}

export function FinancePeriodPicker({
  selection,
  maxDate,
  onChange,
}: FinancePeriodPickerProps) {
  const presetValue: PresetValue =
    selection.kind === 'preset' ? selection.preset : 'custom';

  function handlePresetChange(value: PresetValue) {
    if (value !== 'custom') {
      onChange({ kind: 'preset', preset: value });
    }
  }

  function openCustomRange() {
    if (selection.kind !== 'custom') {
      onChange({ kind: 'custom', from: toMonthStart(maxDate), to: maxDate });
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex gap-2">
        <SegmentedControl
          label="Kỳ xem số liệu"
          options={PRESET_OPTIONS}
          value={presetValue}
          onChange={handlePresetChange}
          className="flex-1 sm:flex-none"
        />
        <Button
          variant="secondary"
          aria-pressed={selection.kind === 'custom'}
          aria-label="Chọn khoảng ngày"
          title="Chọn khoảng ngày"
          onClick={openCustomRange}
          className={cn(
            'px-3',
            selection.kind === 'custom' && 'border-brand text-brand',
          )}
        >
          <CalendarDays className="size-4" />
          <span className="hidden sm:inline">Khoảng ngày</span>
        </Button>
      </div>
      {selection.kind === 'custom' && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="Từ ngày"
            value={selection.from}
            max={maxDate}
            onChange={(event) => {
              if (event.target.value) {
                onChange({ ...selection, from: event.target.value });
              }
            }}
            className={cn(INPUT_CLASS_NAME, 'min-w-0 flex-1 sm:w-40')}
          />
          <span aria-hidden="true" className="text-ink-faint">
            –
          </span>
          <input
            type="date"
            aria-label="Đến ngày"
            value={selection.to}
            max={maxDate}
            onChange={(event) => {
              if (event.target.value) {
                onChange({ ...selection, to: event.target.value });
              }
            }}
            className={cn(INPUT_CLASS_NAME, 'min-w-0 flex-1 sm:w-40')}
          />
        </div>
      )}
    </div>
  );
}
