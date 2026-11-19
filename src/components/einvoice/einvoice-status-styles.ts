import type { EInvoiceTransmissionStatus } from '@/types/einvoice';

export const EINVOICE_STATUS_BADGE_CLASSES: Record<
  EInvoiceTransmissionStatus,
  string
> = {
  pending: 'bg-ink/5 text-ink-soft',
  sent: 'bg-success-soft text-success',
  failed: 'bg-danger-soft text-danger',
  sandbox: 'bg-warning-soft text-warning',
};

export const EINVOICE_STATUS_DOT_CLASSES: Record<
  EInvoiceTransmissionStatus,
  string
> = {
  pending: 'bg-ink-faint',
  sent: 'bg-success',
  failed: 'bg-danger',
  sandbox: 'bg-warning',
};
