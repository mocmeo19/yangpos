'use client';

import { BellRing } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ChoiceCards } from '@/components/ui/ChoiceCards';
import { Field, INPUT_CLASS_NAME } from '@/components/ui/Field';
import { PAGER_CONNECTION_OPTIONS } from '@/data/pager-connections';
import { PAGER_MODEL_OPTIONS, PAGER_MODELS } from '@/data/pager-models';
import { SETTINGS_SECTION_META } from '@/data/settings-sections';
import { usePagerPort } from '@/hooks/use-pager-port';
import { useSettingsDraft } from '@/hooks/use-settings-draft';
import { useToast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/lib/get-error-message';
import { callPagerOverSerial } from '@/lib/pager/call-pager-over-serial';
import { preparePagerSettings } from '@/lib/settings/prepare-pager-settings';
import type { PagerModelId } from '@/types/pager';
import type { PagerModel } from '@/types/pager-model';
import type { SettingsStatus } from '@/types/settings-status';
import { PagerSerialFields } from './PagerSerialFields';
import { RetekessTd157Guide } from './RetekessTd157Guide';
import { SettingsCard } from './SettingsCard';
import { SettingsNote } from './SettingsNote';
import { SettingsSwitchRow } from './SettingsSwitchRow';

const MAX_COUNT_DIGITS = 3;

function parsePagerCount(value: string): number {
  return Number(value.replace(/\D/g, '').slice(0, MAX_COUNT_DIGITS));
}

function describePagerCountHint({
  maxPagerNumber,
  reservedNumbers,
}: PagerModel): string {
  const base = `Thẻ đánh số từ 1, tối đa ${maxPagerNumber}; thu ngân chọn đúng số in trên thẻ đưa khách.`;
  if (reservedNumbers.length === 0) {
    return base;
  }
  return `${base} Bỏ qua số ${reservedNumbers.join(', ')}.`;
}

export function PagerSettingsForm({ status }: { status: SettingsStatus }) {
  const form = useSettingsDraft('pager', {
    prepare: preparePagerSettings,
    successMessage: 'Đã lưu cài đặt thẻ rung',
  });
  const { draft, update } = form;
  const port = usePagerPort();
  const showToast = useToast();
  const [testPagerNumber, setTestPagerNumber] = useState(1);
  const [isTesting, setIsTesting] = useState(false);
  const model = PAGER_MODELS[draft.model];
  const usesSerial =
    draft.enabled && model.supportsSerial && draft.connection === 'serial';

  function changeModel(modelId: PagerModelId) {
    const connection = PAGER_MODELS[modelId].supportsSerial
      ? draft.connection
      : 'manual';
    update({ model: modelId, connection });
  }

  async function handleConnect() {
    try {
      const isConnected = await port.connect();
      if (isConnected) {
        showToast({ title: 'Đã kết nối đế phát thẻ rung' });
      }
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Chưa kết nối được đế phát',
        description: getErrorMessage(error),
      });
    }
  }

  /** Gọi thử bằng cài đặt đang chỉnh, chưa cần lưu. */
  async function handleTestCall() {
    setIsTesting(true);
    try {
      await callPagerOverSerial(preparePagerSettings(draft), testPagerNumber);
      showToast({
        title: `Đã gửi lệnh gọi thẻ số ${testPagerNumber}`,
        description:
          'Thẻ không rung thì kiểm tra lại mẫu lệnh và tốc độ cổng theo tài liệu của hãng.',
      });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Gọi thử chưa thành công',
        description: getErrorMessage(error),
      });
    } finally {
      setIsTesting(false);
    }
  }

  return (
    <SettingsCard
      meta={SETTINGS_SECTION_META.pager}
      status={status}
      form={form}
      actions={
        usesSerial && (
          <Button
            variant="secondary"
            size="sm"
            disabled={isTesting || !port.portLabel}
            onClick={handleTestCall}
          >
            <BellRing className="size-4" />
            {isTesting ? 'Đang gọi…' : `Gọi thử thẻ ${testPagerNumber}`}
          </Button>
        )
      }
    >
      <SettingsSwitchRow
        label="Dùng thẻ rung"
        description="Bán mang đi, tự phục vụ: đưa khách thẻ rung, món xong thì gọi khách tới quầy lấy."
        checked={draft.enabled}
        onChange={(enabled) => update({ enabled })}
      />

      {draft.enabled && (
        <>
          <ChoiceCards
            label="Bộ thẻ rung"
            options={PAGER_MODEL_OPTIONS}
            value={draft.model}
            onChange={changeModel}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Số thẻ trong bộ"
              htmlFor="pager-count"
              hint={describePagerCountHint(model)}
            >
              <input
                id="pager-count"
                inputMode="numeric"
                value={draft.pagerCount ? String(draft.pagerCount) : ''}
                onChange={(event) =>
                  update({ pagerCount: parsePagerCount(event.target.value) })
                }
                className={INPUT_CLASS_NAME}
              />
            </Field>
          </div>

          {draft.model === 'retekess-td157' && <RetekessTd157Guide />}

          {model.supportsSerial && (
            <ChoiceCards
              label="Cách gọi thẻ"
              options={PAGER_CONNECTION_OPTIONS}
              value={draft.connection}
              onChange={(connection) => update({ connection })}
            />
          )}
          {model.supportsSerial && draft.connection === 'manual' && (
            <SettingsNote>
              Bếp bấm “Xong, gọi thẻ” thì ứng dụng hiện số thẻ cần gọi; nhân
              viên bấm số đó rồi CALL trên đế phát. Đơn có thẻ rung đã trả tiền
              trước vẫn ở màn bếp tới khi bấm “Khách đã nhận”.
            </SettingsNote>
          )}
          {usesSerial && (
            <PagerSerialFields
              draft={draft}
              update={update}
              port={port}
              testPagerNumber={testPagerNumber}
              onTestPagerNumberChange={setTestPagerNumber}
              onConnect={handleConnect}
            />
          )}
        </>
      )}
    </SettingsCard>
  );
}
