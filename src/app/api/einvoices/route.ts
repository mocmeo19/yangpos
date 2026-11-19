import { apiRoute, readTimeRange } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { listEInvoicesInRange } from '@/server/repositories/einvoice-repository';

export const GET = apiRoute(async (request) => {
  await requireStaff('finance.manage');
  return listEInvoicesInRange(readTimeRange(request));
});
