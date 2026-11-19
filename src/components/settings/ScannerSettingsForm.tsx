'use client';

import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { cn } from '@/lib/cn';
import {
  prepareScannerSettings,
  SCANNER_CODE_LENGTH_RANGE,
} from '@/lib/settings/prepare-scanner-settings';
import type { ScannerTerminator } from '@/types/settings';
import type { SettingsStatus } from '@/types/settings-status';
import { ScannerTestPanel } from './ScannerTestPanel';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

const TERMINATOR_OPTIONS: readonly SegmentedOption<ScannerTerminator>[] = [
  { value: 'Enter', label: 'Enter' },
  { value: 'Tab', label: 'Tab' },
];

// Khoảng cách tối đa giữa hai ký tự (ms): máy có dây rất nhanh, máy Bluetooth có thể chậm hơn.
const SPEED_OPTIONS: readonly SegmentedOption<string>[] = [
  { value: '30', label: 'Nhanh' },
  { value: '50', label: 'Vừa' },
  { value: '100', label: 'Chậm' },
];

const MAX_LENGTH_DIGITS = 2;

export function ScannerSettingsForm({ status }: { status: SettingsStatus }) {
  const form = useSettingsDraft('scanner', {
    prepare: prepareScannerSettings,
    successMessage: 'Đã lưu cài đặt máy quét',
  });
  const { draft, update } = form;

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.scanner}
      status={status}
      form={form}
    >
      <SettingsSwitchRow
        label="Dùng máy quét mã vạch"
        description="Quét mã trên màn hình Bán hàng để thêm món vào phiếu."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      <SettingsNote>
        Hỗ trợ máy quét USB hoặc Bluetooth ở chế độ bàn phím (HID), loại phổ
        biến nhất: cắm vào là dùng, không cần cài phần mềm. Gán mã cho từng món
        trong Thực đơn › Sửa món › Mã vạch.
      </SettingsNote>
      <fieldset
        disabled={!draft.enabled}
        className="grid gap-4 disabled:opacity-60 sm:grid-cols-3"
      >
        <legend className="sr-only">Cách nhận diện mã quét</legend>
        <div>
          <p aria-hidden="true" className="mb-1.5 text-sm font-semibold">
            Phím kết thúc mã
          </p>
          <SegmentedControl
            label="Phím kết thúc mã"
            options={TERMINATOR_OPTIONS}
            value={draft.terminator}
            onChange={(terminator) => update({ terminator })}
          />
        </div>
        <div>
          <p aria-hidden="true" className="mb-1.5 text-sm font-semibold">
            Tốc độ máy quét
          </p>
          <SegmentedControl
            label="Tốc độ máy quét"
            options={SPEED_OPTIONS}
            value={String(draft.maxKeyIntervalMs)}
            onChange={(value) => update({ maxKeyIntervalMs: Number(value) })}
          />
          <p className="mt-1.5 text-xs text-ink-soft">
            Chọn Chậm nếu máy quét Bluetooth hay bỏ sót mã.
          </p>
        </div>
        <Field
          label="Độ dài mã tối thiểu"
          htmlFor="scanner-min-length"
          hint={`Từ ${SCANNER_CODE_LENGTH_RANGE.min} đến ${SCANNER_CODE_LENGTH_RANGE.max} ký tự.`}
        >
          <input
            id="scanner-min-length"
            inputMode="numeric"
            autoComplete="off"
            value={draft.minLength ? String(draft.minLength) : ''}
            onChange={(event) =>
              update({
                minLength: Number(
                  event.target.value
                    .replace(/\D/g, '')
                    .slice(0, MAX_LENGTH_DIGITS),
                ),
              })
            }
            className={cn(INPUT_CLASS_NAME, 'font-mono')}
          />
        </Field>
      </fieldset>
      <ScannerTestPanel scanner={draft} />
    </SettingsCard>
  );
}
