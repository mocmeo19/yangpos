import 'server-only';
import type { PosCollections } from '@/server/db/collections';

/**
 * Tăng bộ đếm bằng một lệnh `$inc` nguyên tử nên hai máy cùng lấy số không bao giờ trùng. Gọi ngay
 * trước khi lưu bản ghi, sau khi đã kiểm tra hợp lệ, để hạn chế số bị bỏ qua khi lưu thất bại.
 */
export async function nextCounterValue(
  collections: PosCollections,
  id: string,
): Promise<number> {
  const counter = await collections.counters.findOneAndUpdate(
    { id },
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: 'after' },
  );
  if (!counter) {
    throw new Error(`Không cấp được số cho bộ đếm ${id}.`);
  }
  return counter.value;
}
