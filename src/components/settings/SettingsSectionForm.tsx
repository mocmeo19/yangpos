import type { SettingsSection } from '@/types/settings';
import type { SettingsStatus } from '@/types/settings-status';
import { BankTransferSettingsForm } from './BankTransferSettingsForm';
import { CardPaymentSettingsForm } from './CardPaymentSettingsForm';
import { CashDrawerSettingsForm } from './CashDrawerSettingsForm';
import { EInvoiceSettingsForm } from './EInvoiceSettingsForm';
import { PagerSettingsForm } from './PagerSettingsForm';
import { PrinterSettingsForm } from './PrinterSettingsForm';
import { ScannerSettingsForm } from './ScannerSettingsForm';
import { StoreSettingsForm } from './StoreSettingsForm';

interface SettingsSectionFormProps {
  section: SettingsSection;
  status: SettingsStatus;
}

export function SettingsSectionForm({
  section,
  status,
}: SettingsSectionFormProps) {
  switch (section) {
    case 'store':
      return <StoreSettingsForm status={status} />;
    case 'eInvoice':
      return <EInvoiceSettingsForm status={status} />;
    case 'printer':
      return <PrinterSettingsForm status={status} />;
    case 'cashDrawer':
      return <CashDrawerSettingsForm status={status} />;
    case 'pager':
      return <PagerSettingsForm status={status} />;
    case 'bankTransfer':
      return <BankTransferSettingsForm status={status} />;
    case 'cardPayment':
      return <CardPaymentSettingsForm status={status} />;
    case 'scanner':
      return <ScannerSettingsForm status={status} />;
  }
}
