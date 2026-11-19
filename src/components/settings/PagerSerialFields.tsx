'use client';

import { Usb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { SERIAL_BAUD_RATES } from '@/data/serial-baud-rates';
import type { PagerPortState } from '@/hooks/use-pager-port';
import { cn } from '@/lib/cn';
import { getErrorMessage } from '@/lib/get-error-message';
import { buildPagerCommand } from '@/lib/pager/build-pager-command';
import { formatBytesHex } from '@/lib/pager/format-bytes-hex';
import { SERIAL_UNSUPPORTED_MESSAGE } from '@/lib/pager/get-serial-api';
import type { PagerSettings } from '@/types/pager';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

interface CommandPreview {
  text: string;
  isError: boolean;
}

function previewCommand(template: string, pagerNumber: number): CommandPreview {
  if (!template.trim()) {
    return { text: 'Chưa có mẫu lệnh.', isError: true };
  }
  try {
    return {
      text: formatBytesHex(buildPagerCommand(template.trim(), pagerNumber)),
      isError: false,
    };
  } catch (error) {
    return { text: getErrorMessage(error), isError: true };
  }
}

interface PagerSerialFieldsProps {
  draft: PagerSettings;
  update: (changes: Partial<PagerSettings>) => void;
  port: PagerPortState;
  testPagerNumber: number;
  onTestPagerNumberChange: (pagerNumber: number) => void;
  onConnect: () => void;
}

/** Phần riêng của đế phát nối USB/COM: cổng, tốc độ, mẫu lệnh và xem trước byte sẽ gửi. */
export function PagerSerialFields({
  draft,
  update,
  port,
  testPagerNumber,
  onTestPagerNumberChange,
  onConnect,
}: PagerSerialFieldsProps) {
  if (!port.isSupported) {
    return (
      <SettingsNote tone="warning">{SERIAL_UNSUPPORTED_MESSAGE}</SettingsNote>
    );
  }

  const preview = previewCommand(draft.commandTemplate, testPagerNumber);

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line bg-surface-muted px-4 py-3">
        <Usb aria-hidden="true" className="size-5 shrink-0 text-ink-soft" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Đế phát</p>
          <p className="text-xs text-ink-soft">
            {port.portLabel ??
              'Chưa kết nối. Cắm cáp USB/RS232 rồi bấm Kết nối.'}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={onConnect}>
          {port.portLabel ? 'Đổi cổng' : 'Kết nối đế phát'}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_160px_120px]">
        <Field
          label="Mẫu lệnh gọi thẻ"
          htmlFor="pager-command-template"
          hint="{n} là số thẻ, {n:3} đủ 3 chữ số, {n:byte} gửi 1 byte; \r \n \xNN là ký tự điều khiển."
        >
          <input
            id="pager-command-template"
            autoComplete="off"
            spellCheck={false}
            placeholder="CALL{n:3}\r"
            value={draft.commandTemplate}
            onChange={(event) =>
              update({ commandTemplate: event.target.value })
            }
            className={cn(INPUT_CLASS_NAME, 'font-mono')}
          />
        </Field>
        <Field label="Tốc độ cổng" htmlFor="pager-baud-rate">
          <select
            id="pager-baud-rate"
            value={draft.baudRate}
            onChange={(event) =>
              update({ baudRate: Number(event.target.value) })
            }
            className={INPUT_CLASS_NAME}
          >
            {SERIAL_BAUD_RATES.map((baudRate) => (
              <option key={baudRate} value={baudRate}>
                {baudRate}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Thẻ gọi thử" htmlFor="pager-test-number">
          <input
            id="pager-test-number"
            inputMode="numeric"
            value={String(testPagerNumber)}
            onChange={(event) =>
              onTestPagerNumberChange(
                Math.max(1, Number(event.target.value.replace(/\D/g, '')) || 1),
              )
            }
            className={cn(INPUT_CLASS_NAME, 'font-mono')}
          />
        </Field>
      </div>

      <p className="text-xs text-ink-soft">
        Byte gửi khi gọi thẻ {testPagerNumber}:{' '}
        <span
          className={cn(
            'font-mono font-semibold',
            preview.isError ? 'text-danger' : 'text-ink',
          )}
        >
          {preview.text}
        </span>
      </p>

      <SettingsSwitchRow
        label="Tự gọi thẻ khi bếp báo xong món"
        description="Tắt nếu muốn bấm “Gọi lại” trên phiếu bếp mới gọi khách."
        checked={draft.autoCallWhenReady}
        onChange={(autoCallWhenReady) => update({ autoCallWhenReady })}
      />

      <SettingsNote>
        Mẫu lệnh lấy trong tài liệu kết nối POS của hãng đế phát; một số hãng
        như Retekess cung cấp giao thức cổng serial khi được yêu cầu. Lần đầu
        kết nối, trình duyệt hỏi quyền dùng cổng; chỉ chọn cổng của đế phát.
      </SettingsNote>
    </>
  );
}
