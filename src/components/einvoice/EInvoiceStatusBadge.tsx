import { EINVOICE_TRANSMISSION_LABELS } from '@/data/einvoice-labels';
import { cn } from '@/lib/cn';
import type { EInvoiceTransmissionStatus } from '@/types/einvoice';
import {
  EINVOICE_STATUS_BADGE_CLASSES,
  EINVOICE_STATUS_DOT_CLASSES,
} from './einvoice-status-styles';

export function EInvoiceStatusBadge({
  status,
}: {
  status: EInvoiceTransmissionStatus;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        EINVOICE_STATUS_BADGE_CLASSES[status],
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 shrink-0 rounded-full',
          EINVOICE_STATUS_DOT_CLASSES[status],
        )}
      />
      {EINVOICE_TRANSMISSION_LABELS[status]}
    </span>
  );
}
