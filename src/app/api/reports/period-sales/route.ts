import { apiRoute, readTimeRange } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { listEInvoicesForOrders } from '@/server/repositories/einvoice-repository';
import { listPaidOrdersInRange } from '@/server/repositories/order-repository';
import type { PeriodSales } from '@/types/period-sales';

/** Đơn đã thu tiền trong kỳ kèm hóa đơn điện tử của chúng, cho báo cáo lãi lỗ. */
export const GET = apiRoute(async (request): Promise<PeriodSales> => {
  await requireStaff('reports.view', 'finance.manage');
  const orders = await listPaidOrdersInRange(readTimeRange(request));
  const invoices = await listEInvoicesForOrders(
    orders.map((order) => order.id),
  );
  return { orders, invoices };
});
