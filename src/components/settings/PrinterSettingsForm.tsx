'use client';

import { PrinterCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ChoiceCards } from '@/components/ui/ChoiceCards';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import {
  SegmentedControl,
  type SegmentedOption,
} from '@/components/ui/SegmentedControl';
import { PRINTER_MODE_OPTIONS } from '@/data/printer-modes';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { useSettings } from '@/hooks/use-settings';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { useTestPrint } from '@/hooks/use-test-print';
import { cn } from '@/lib/cn';
import { PRINTER_PORT_RANGE } from '@/lib/printer/printer-target';
import { preparePrinterSettings } from '@/lib/settings/prepare-printer-settings';
import type { SettingsStatus } from '@/types/settings-status';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

const PAPER_WIDTH_OPTIONS: readonly SegmentedOption<string>[] = [
  { value: '80', label: '80 mm' },
  { value: '58', label: '58 mm' },
];

const COPIES_OPTIONS: readonly SegmentedOption<string>[] = [
  { value: '1', label: '1 liên' },
  { value: '2', label: '2 liên' },
  { value: '3', label: '3 liên' },
];

const MAX_PORT_DIGITS = 5;

function parsePort(value: string): number {
  return Number(value.replace(/\D/g, '').slice(0, MAX_PORT_DIGITS));
}

export function PrinterSettingsForm({ status }: { status: SettingsStatus }) {
  const { settings } = useSettings();
  const form = useSettingsDraft('printer', {
    prepare: preparePrinterSettings,
    successMessage: 'Đã lưu cài đặt máy in',
  });
  const { draft, update } = form;
  const { isPrinting, testPrint } = useTestPrint();
  const isPrinterOff = draft.mode === 'none';
  const isDrawerUnreachable =
    settings.cashDrawer.enabled && draft.mode !== 'network';

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.printer}
      status={status}
      form={form}
      actions={
        <Button
          variant="secondary"
          size="sm"
          disabled={isPrinterOff || isPrinting}
          onClick={() => testPrint(draft)}
        >
          <PrinterCheck className="size-4" />
          {isPrinting ? 'Đang in…' : 'In thử'}
        </Button>
      }
    >
      <ChoiceCards
        label="Cách in"
        options={PRINTER_MODE_OPTIONS}
        value={draft.mode}
        onChange={(mode) => update({ mode })}
      />

      {draft.mode === 'network' && (
        <>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
            <Field
              label="Địa chỉ IP máy in"
              htmlFor="printer-host"
              hint="Giữ nút FEED khi bật máy in để in trang tự kiểm tra có ghi địa chỉ IP."
            >
              <input
                id="printer-host"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                placeholder="192.168.1.100"
                value={draft.networkHost}
                onChange={(event) =>
                  update({ networkHost: event.target.value })
                }
                className={cn(INPUT_CLASS_NAME, 'font-mono')}
              />
            </Field>
            <Field
              label="Cổng"
              htmlFor="printer-port"
              hint={`Thường là ${PRINTER_PORT_RANGE.min}.`}
            >
              <input
                id="printer-port"
                inputMode="numeric"
                autoComplete="off"
                value={draft.networkPort ? String(draft.networkPort) : ''}
                onChange={(event) =>
                  update({ networkPort: parsePort(event.target.value) })
                }
                className={cn(INPUT_CLASS_NAME, 'font-mono')}
              />
            </Field>
          </div>
          <SettingsNote>
            Lệnh in đi từ máy chủ YangPOS tới máy in, nên máy chủ phải chạy
            trong cùng mạng với máy in, ví dụ chạy YangPOS ngay trên máy tính
            đặt tại quầy. Hóa đơn được in dạng ảnh nên tiếng Việt có dấu hiển
            thị đúng trên mọi máy in nhiệt ESC/POS.
          </SettingsNote>
        </>
      )}

      {draft.mode === 'browser' && (
        <SettingsNote>
          Trong hộp thoại in, chọn máy in nhiệt, đặt lề “Không có” và tắt “Đầu
          trang và chân trang”. Muốn in ngay không cần bấm, mở Chrome với tham
          số --kiosk-printing.
        </SettingsNote>
      )}

      {isDrawerUnreachable && (
        <SettingsNote tone="warning">
          Két tiền đang bật nhưng chỉ tự mở được khi in bằng máy in mạng LAN.
        </SettingsNote>
      )}

      {!isPrinterOff && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p aria-hidden="true" className="mb-1.5 text-sm font-semibold">
                Khổ giấy
              </p>
              <SegmentedControl
                label="Khổ giấy"
                options={PAPER_WIDTH_OPTIONS}
                value={String(draft.paperWidth)}
                onChange={(value) =>
                  update({ paperWidth: value === '58' ? 58 : 80 })
                }
              />
            </div>
            <div>
              <p aria-hidden="true" className="mb-1.5 text-sm font-semibold">
                Số liên mỗi lần in
              </p>
              <SegmentedControl
                label="Số liên mỗi lần in"
                options={COPIES_OPTIONS}
                value={String(draft.copies)}
                onChange={(value) => update({ copies: Number(value) })}
              />
            </div>
          </div>
          <SettingsSwitchRow
            label="Tự in hóa đơn sau khi thanh toán"
            description="In ngay khi bấm Xác nhận đã thu, không cần bấm thêm."
            checked={draft.autoPrintAfterPayment}
            onChange={(autoPrintAfterPayment) =>
              update({ autoPrintAfterPayment })
            }
          />
        </>
      )}
    </SettingsCard>
  );
}
