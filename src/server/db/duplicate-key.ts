import 'server-only';
import { MongoServerError } from 'mongodb';

const DUPLICATE_KEY_CODE = 11000;

/** Lỗi trùng khóa; truyền `indexName` để biết chính xác chỉ mục duy nhất nào đã chặn lại. */
export function isDuplicateKeyError(
  error: unknown,
  indexName?: string,
): boolean {
  if (
    !(error instanceof MongoServerError) ||
    error.code !== DUPLICATE_KEY_CODE
  ) {
    return false;
  }
  return indexName === undefined || error.message.includes(indexName);
}
