import { VIETNAM_BANKS } from '@/data/vietnam-banks';
import type { VietnamBank } from '@/types/vietnam-bank';

export function findVietnamBank(bin: string): VietnamBank | undefined {
  return VIETNAM_BANKS.find((bank) => bank.bin === bin);
}
