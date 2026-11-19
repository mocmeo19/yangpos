import { DEFAULT_SETTINGS } from '@/data/default-settings';
import { applyPagerModel } from '@/lib/pager/apply-pager-model';
import type { AppSettings } from '@/types/settings';

/** Ghép từng phần với giá trị mặc định để trường mới thêm sau này vẫn có giá trị hợp lệ. */
export function mergeWithDefaultSettings(
  stored: Partial<AppSettings> | undefined,
): AppSettings {
  return {
    store: { ...DEFAULT_SETTINGS.store, ...stored?.store },
    eInvoice: { ...DEFAULT_SETTINGS.eInvoice, ...stored?.eInvoice },
    printer: { ...DEFAULT_SETTINGS.printer, ...stored?.printer },
    cashDrawer: { ...DEFAULT_SETTINGS.cashDrawer, ...stored?.cashDrawer },
    pager: applyPagerModel({ ...DEFAULT_SETTINGS.pager, ...stored?.pager }),
    bankTransfer: { ...DEFAULT_SETTINGS.bankTransfer, ...stored?.bankTransfer },
    cardPayment: { ...DEFAULT_SETTINGS.cardPayment, ...stored?.cardPayment },
    scanner: { ...DEFAULT_SETTINGS.scanner, ...stored?.scanner },
  };
}
