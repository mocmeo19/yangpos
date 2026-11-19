import { apiRoute, readNumberParam } from '@/server/api/api-route';
import { requireStaff } from '@/server/auth/require-staff';
import { getCashBookSource } from '@/server/repositories/cash-entry-repository';

/** Dữ liệu tính sổ quỹ tới cuối kỳ `?end=` (mốc mili giây). */
export const GET = apiRoute(async (request) => {
  await requireStaff('finance.manage');
  return getCashBookSource(readNumberParam(request, 'end'));
});
