import { concatBytes } from '@/lib/bytes/concat-bytes';
import {
  ESC_POS_FEED_AND_CUT,
  ESC_POS_INITIALIZE,
  ESC_POS_OPEN_CASH_DRAWER,
} from './commands';

interface ReceiptPrintJobInput {
  raster: Uint8Array;
  copies: number;
  openCashDrawer: boolean;
}

export function buildReceiptPrintJob({
  raster,
  copies,
  openCashDrawer,
}: ReceiptPrintJobInput): Uint8Array {
  const parts: Uint8Array[] = [ESC_POS_INITIALIZE];
  // Mở két trước khi in để thu ngân cất tiền trong lúc máy in chạy.
  if (openCashDrawer) {
    parts.push(ESC_POS_OPEN_CASH_DRAWER);
  }
  for (let copy = 0; copy < copies; copy += 1) {
    parts.push(raster, ESC_POS_FEED_AND_CUT);
  }
  return concatBytes(parts);
}

export function buildCashDrawerJob(): Uint8Array {
  return concatBytes([ESC_POS_INITIALIZE, ESC_POS_OPEN_CASH_DRAWER]);
}
