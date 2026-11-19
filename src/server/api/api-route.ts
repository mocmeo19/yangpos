import 'server-only';
import { unstable_rethrow } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { UserFacingError } from '@/lib/errors/user-facing-error';
import { isDuplicateKeyError } from '@/server/db/duplicate-key';
import type { TimeRange } from '@/lib/day-range';

function errorResponse(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}

function toErrorResponse(error: unknown): Response {
  if (error instanceof UserFacingError) {
    return errorResponse(error.message, error.status);
  }
  if (isDuplicateKeyError(error)) {
    return errorResponse(
      'Dữ liệu bị trùng với bản ghi đã có (vd mã vạch đã dùng cho món khác).',
      409,
    );
  }
  console.error('[api]', error);
  return errorResponse('Máy chủ gặp lỗi, vui lòng thử lại.', 500);
}

/**
 * Bọc route handler: trả JSON khi thành công (204 khi không có dữ liệu) và đổi lỗi thành mã HTTP
 * kèm thông báo, chỉ để lộ thông báo của lỗi nghiệp vụ.
 */
export function apiRoute<TContext = unknown>(
  handler: (request: NextRequest, context: TContext) => Promise<unknown>,
): (request: NextRequest, context: TContext) => Promise<Response> {
  return async (request, context) => {
    try {
      const data = await handler(request, context);
      if (data === undefined) {
        return new Response(null, { status: 204 });
      }
      return Response.json(data);
    } catch (error) {
      // Tín hiệu nội bộ của Next.js (vd dừng prerender khi đọc cookie) phải được ném tiếp.
      unstable_rethrow(error);
      return toErrorResponse(error);
    }
  };
}

export async function readJsonBody<TSchema extends z.ZodType>(
  request: Request,
  schema: TSchema,
): Promise<z.output<TSchema>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new UserFacingError('Dữ liệu gửi lên không phải JSON hợp lệ.');
  }
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new UserFacingError('Dữ liệu gửi lên không hợp lệ.');
  }
  return result.data;
}

/** Context của route có tham số động `[id]`. */
export interface IdRouteContext {
  params: Promise<{ id: string }>;
}

export function readNumberParam(request: NextRequest, name: string): number {
  const value = Number(request.nextUrl.searchParams.get(name));
  if (!Number.isFinite(value)) {
    throw new UserFacingError(`Thiếu hoặc sai tham số ${name}.`);
  }
  return value;
}

/** Đọc khoảng thời gian `[start, end)` từ query `?start=&end=` (mốc mili giây). */
export function readTimeRange(request: NextRequest): TimeRange {
  const start = readNumberParam(request, 'start');
  const end = readNumberParam(request, 'end');
  if (end < start) {
    throw new UserFacingError('Khoảng thời gian không hợp lệ.');
  }
  return { start, end };
}
