import { PAGER_MODELS } from '@/data/pager-models';
import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import { findVietnamBank } from '@/lib/find-vietnam-bank';
import { isBankTransferReady } from '@/lib/is-bank-transfer-ready';
import type { AppSettings, SettingsSection } from '@/types/settings';
import type { SettingsStatus } from '@/types/settings-status';

const TURNED_OFF: SettingsStatus = { tone: 'neutral', label: 'Đang tắt' };
const TURNED_ON: SettingsStatus = { tone: 'success', label: 'Đang bật' };

function describeStore({ store }: AppSettings): SettingsStatus {
  if (!store.name) {
    return { tone: 'warning', label: 'Chưa có tên' };
  }
  return { tone: 'success', label: 'Đã thiết lập' };
}

function describeEInvoice({ eInvoice }: AppSettings): SettingsStatus {
  if (!eInvoice.enabled) {
    return TURNED_OFF;
  }
  const provider = getEInvoiceProvider(eInvoice.providerId);
  if (provider.isSandbox) {
    return { tone: 'warning', label: 'Thử nghiệm' };
  }
  return { tone: 'success', label: provider.label };
}

function describePrinter({ printer }: AppSettings): SettingsStatus {
  switch (printer.mode) {
    case 'browser':
      return { tone: 'success', label: 'Qua trình duyệt' };
    case 'network':
      return { tone: 'success', label: `LAN ${printer.networkHost}` };
    default:
      return TURNED_OFF;
  }
}

function describeCashDrawer({
  cashDrawer,
  printer,
}: AppSettings): SettingsStatus {
  if (!cashDrawer.enabled) {
    return TURNED_OFF;
  }
  if (printer.mode !== 'network') {
    return { tone: 'warning', label: 'Cần máy in LAN' };
  }
  return TURNED_ON;
}

function describeBankTransfer({ bankTransfer }: AppSettings): SettingsStatus {
  if (!bankTransfer.enabled) {
    return TURNED_OFF;
  }
  if (!isBankTransferReady(bankTransfer)) {
    return { tone: 'warning', label: 'Chưa có tài khoản' };
  }
  const bankName = findVietnamBank(bankTransfer.bankBin)?.shortName;
  return { tone: 'success', label: bankName ?? 'Đã thiết lập' };
}

function describePager({ pager }: AppSettings): SettingsStatus {
  if (!pager.enabled) {
    return TURNED_OFF;
  }
  const model = PAGER_MODELS[pager.model];
  if (!model.supportsSerial) {
    return {
      tone: 'success',
      label: `${pager.pagerCount} thẻ · ${model.shortLabel}`,
    };
  }
  switch (pager.connection) {
    case 'serial':
      return { tone: 'success', label: `${pager.pagerCount} thẻ · USB/COM` };
    case 'manual':
      return { tone: 'success', label: `${pager.pagerCount} thẻ · bấm tay` };
  }
}

/** Tóm tắt trạng thái từng phần cài đặt để hiện trên menu và đầu mỗi khối. */
export function describeSettingsStatus(
  settings: AppSettings,
): Record<SettingsSection, SettingsStatus> {
  return {
    store: describeStore(settings),
    eInvoice: describeEInvoice(settings),
    printer: describePrinter(settings),
    cashDrawer: describeCashDrawer(settings),
    pager: describePager(settings),
    bankTransfer: describeBankTransfer(settings),
    cardPayment: settings.cardPayment.enabled ? TURNED_ON : TURNED_OFF,
    scanner: settings.scanner.enabled ? TURNED_ON : TURNED_OFF,
  };
}
