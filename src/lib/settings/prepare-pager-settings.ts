import { PAGER_MODELS } from '@/data/pager-models';
import { SERIAL_BAUD_RATES } from '@/data/serial-baud-rates';
import { applyPagerModel } from '@/lib/pager/apply-pager-model';
import {
  buildPagerCommand,
  hasPagerPlaceholder,
} from '@/lib/pager/build-pager-command';
import type { PagerSettings } from '@/types/pager';

function assertValid(isValid: boolean, message: string): void {
  if (!isValid) {
    throw new Error(message);
  }
}

/** Mẫu lệnh chỉ bắt buộc khi gửi qua cổng USB/COM; chế độ bấm tay không cần. */
export function preparePagerSettings(settings: PagerSettings): PagerSettings {
  const prepared = applyPagerModel({
    ...settings,
    commandTemplate: settings.commandTemplate.trim(),
  });
  const { maxPagerNumber } = PAGER_MODELS[prepared.model];
  assertValid(
    Number.isInteger(prepared.pagerCount) &&
      prepared.pagerCount >= 1 &&
      prepared.pagerCount <= maxPagerNumber,
    `Số thẻ trong bộ từ 1 đến ${maxPagerNumber}.`,
  );
  if (!prepared.enabled || prepared.connection !== 'serial') {
    return prepared;
  }
  assertValid(
    SERIAL_BAUD_RATES.includes(prepared.baudRate),
    'Chọn tốc độ cổng theo tài liệu của đế phát.',
  );
  assertValid(
    hasPagerPlaceholder(prepared.commandTemplate),
    'Mẫu lệnh cần có {n} ở vị trí số thẻ, vd CALL{n:3}\\r.',
  );
  // Dựng thử với số thẻ lớn nhất để báo lỗi ngay khi lưu thay vì lúc bếp gọi khách.
  buildPagerCommand(prepared.commandTemplate, prepared.pagerCount);
  return prepared;
}
