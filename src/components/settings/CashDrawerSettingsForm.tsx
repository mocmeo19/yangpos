'use client';

import { LockOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PRINTER_MODE_LABELS } from '@/data/printer-modes';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { useSettings } from '@/hooks/use-settings';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { useTestCashDrawer } from '@/hooks/use-test-cash-drawer';
import type { SettingsStatus } from '@/types/settings-status';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

export function CashDrawerSettingsForm({ status }: { status: SettingsStatus }) {
  const { settings } = useSettings();
  const form = useSettingsDraft('cashDrawer', {
    successMessage: 'Đã lưu cài đặt két tiền',
  });
  const { draft, update } = form;
  const { isOpening, testCashDrawer } = useTestCashDrawer();
  const isNetworkPrinter = settings.printer.mode === 'network';

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.cashDrawer}
      status={status}
      form={form}
      actions={
        <Button
          variant="secondary"
          size="sm"
          disabled={!isNetworkPrinter || isOpening}
          onClick={() => testCashDrawer(settings.printer)}
        >
          <LockOpen className="size-4" />
          {isOpening ? 'Đang mở…' : 'Mở két thử'}
        </Button>
      }
    >
      <SettingsNote title="Cách kết nối">
        Cắm dây RJ11 của két vào cổng DK (Cash drawer) phía sau máy in hóa đơn.
        YangPOS gửi lệnh mở két qua máy in mạng LAN nên két bật ra ngay khi thu
        tiền mặt.
      </SettingsNote>

      {!isNetworkPrinter && (
        <SettingsNote
          tone="warning"
          title={`Máy in đang dùng: ${PRINTER_MODE_LABELS[settings.printer.mode]}`}
        >
          Két chỉ tự mở khi dùng máy in mạng LAN. Với máy in USB, bật mục mở két
          (Cash drawer) trong driver máy in để két mở mỗi lần in hóa đơn.{' '}
          <a
            href="#printer"
            className="font-semibold underline underline-offset-2"
          >
            Đổi cách in
          </a>
        </SettingsNote>
      )}

      <SettingsSwitchRow
        label="Dùng két tiền"
        description="Bật khi két đã cắm vào máy in hóa đơn."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />
      <SettingsSwitchRow
        label="Tự mở két khi thu tiền mặt"
        description="Két bật ra khi bấm Xác nhận đã thu với hình thức tiền mặt."
        checked={draft.openOnCashPayment}
        disabled={!draft.enabled}
        onChange={(openOnCashPayment) => update({ openOnCashPayment })}
      />
    </SettingsCard>
  );
}
