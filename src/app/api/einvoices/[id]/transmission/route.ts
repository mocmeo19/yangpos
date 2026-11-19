import { transmitChangesSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { saveEInvoiceTransmitChanges } from '@/server/repositories/einvoice-repository';

/** Lưu kết quả gửi hóa đơn tới nhà cung cấp (kể cả số, mã do nhà cung cấp cấp). */
export const PUT = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('orders.pay', 'finance.manage');
  const { id } = await params;
  await saveEInvoiceTransmitChanges(
    id,
    await readJsonBody(request, transmitChangesSchema),
  );
});
