import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { EInvoice, InvoiceBuyer } from '@/types/einvoice';
import type { EInvoiceTransmitChanges } from '@/types/einvoice-provider';
import { API_PATHS, ORDER_DEPENDENT_PATHS } from './api-paths';

/** Máy chủ lập hóa đơn theo cài đặt hóa đơn điện tử đã lưu, không theo dữ liệu trình duyệt gửi. */
export async function issueEInvoiceForOrder(
  orderId: string,
  buyer: InvoiceBuyer | null,
): Promise<EInvoice> {
  const invoice = await apiFetch<EInvoice>(
    `${API_PATHS.orders}/${orderId}/einvoice`,
    'POST',
    { buyer },
  );
  await revalidateApi(API_PATHS.einvoices, ...ORDER_DEPENDENT_PATHS);
  return invoice;
}

export async function findEInvoiceForOrder(
  orderId: string,
): Promise<EInvoice | null> {
  return apiFetch<EInvoice | null>(`${API_PATHS.orders}/${orderId}/einvoice`);
}

export async function saveEInvoiceTransmitChanges(
  id: string,
  changes: EInvoiceTransmitChanges,
): Promise<void> {
  await apiFetch<void>(
    `${API_PATHS.einvoices}/${id}/transmission`,
    'PUT',
    changes,
  );
  await revalidateApi(API_PATHS.einvoices, ...ORDER_DEPENDENT_PATHS);
}
