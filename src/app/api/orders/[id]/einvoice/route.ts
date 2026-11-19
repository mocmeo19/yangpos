import { issueEInvoiceSchema } from '@/server/api/api-schemas';
import {
  apiRoute,
  readJsonBody,
  type IdRouteContext,
} from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  findEInvoiceForOrder,
  issueEInvoiceForOrder,
} from '@/server/repositories/einvoice-repository';

/** Hóa đơn điện tử của đơn; `null` khi đơn chưa có hóa đơn. */
export const GET = apiRoute<IdRouteContext>(async (_request, { params }) => {
  await requireStaff();
  const { id } = await params;
  return findEInvoiceForOrder(id);
});

export const POST = apiRoute<IdRouteContext>(async (request, { params }) => {
  await requireStaff('orders.pay', 'finance.manage');
  const { id } = await params;
  const { buyer } = await readJsonBody(request, issueEInvoiceSchema);
  return issueEInvoiceForOrder(id, buyer);
});
