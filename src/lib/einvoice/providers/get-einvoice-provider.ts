import type {
  EInvoiceProvider,
  EInvoiceProviderId,
} from '@/types/einvoice-provider';
import { MISA_PROVIDER } from './misa-provider';
import { SANDBOX_PROVIDER } from './sandbox-provider';

/** Thêm nhà cung cấp khác (vd Viettel, VNPT) bằng một nhánh mới khi đã có tài khoản API. */
export function getEInvoiceProvider(id: EInvoiceProviderId): EInvoiceProvider {
  switch (id) {
    case 'sandbox':
      return SANDBOX_PROVIDER;
    case 'misa':
      return MISA_PROVIDER;
  }
}
