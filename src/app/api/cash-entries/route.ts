import { cashEntryInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody, readTimeRange } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import {
  addCashEntry,
  listCashEntriesInRange,
} from '@/server/repositories/cash-entry-repository';

export const GET = apiRoute(async (request) => {
  await requireStaff('finance.manage');
  return listCashEntriesInRange(readTimeRange(request));
});

export const POST = apiRoute(async (request) => {
  await requireStaff('finance.manage');
  return addCashEntry(await readJsonBody(request, cashEntryInputSchema));
});
