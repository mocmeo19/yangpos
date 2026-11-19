'use client';

import { INPUT_CLASS_NAME } from '@/components/ui/Field';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import type { ReportPreset, ReportSelection } from '@/types/report-range';

type PresetValue = ReportPreset | 'custom';

const PRESET_OPTIONS: readonly SegmentedOption<PresetValue>[] = [
  { value: 'today', label: 'Hôm nay' },
  { value: 'yesterday', label: 'Hôm qua' },
  { value: 'last7Days', label: '7 ngày' },
  { value: 'last30Days', label: '30 ngày' },
];

interface ReportRangePickerProps {
  selection: ReportSelection;
  maxDate: string;
  onChange: (selection: ReportSelection) => void;
}

export function ReportRangePicker({
  selection,
  maxDate,
  onChange,
}: ReportRangePickerProps) {
  const presetValue: PresetValue =
    selection.kind === 'preset' ? selection.preset : 'custom';

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <SegmentedControl
        label="Khoảng thời gian"
        options={PRESET_OPTIONS}
        value={presetValue}
        onChange={(value) => {
          if (value !== 'custom') {
            onChange({ kind: 'preset', preset: value });
          }
        }}
        className="w-full sm:w-auto"
      />
      <div className="w-full sm:w-48">
        <input
          type="date"
          aria-label="Chọn một ngày cụ thể"
          value={selection.kind === 'day' ? selection.date : ''}
          max={maxDate}
          onChange={(event) => {
            if (event.target.value) {
              onChange({ kind: 'day', date: event.target.value });
            }
          }}
          className={INPUT_CLASS_NAME}
        />
      </div>
    </div>
  );
}
