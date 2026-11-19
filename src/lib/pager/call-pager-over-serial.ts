import type { PagerSettings } from '@/types/pager';
import { buildPagerCommand } from './build-pager-command';
import { findPagerPort } from './find-pager-port';
import { getSerialApi, SERIAL_UNSUPPORTED_MESSAGE } from './get-serial-api';
import { writeSerialCommand } from './write-serial-command';

export async function callPagerOverSerial(
  settings: PagerSettings,
  pagerNumber: number,
): Promise<void> {
  const serial = getSerialApi();
  if (!serial) {
    throw new Error(SERIAL_UNSUPPORTED_MESSAGE);
  }
  const port = await findPagerPort(serial);
  if (!port) {
    throw new Error(
      'Chưa kết nối đế phát thẻ rung. Vào Cài đặt › Thẻ rung để kết nối.',
    );
  }
  await writeSerialCommand(
    port,
    settings.baudRate,
    buildPagerCommand(settings.commandTemplate, pagerNumber),
  );
}
