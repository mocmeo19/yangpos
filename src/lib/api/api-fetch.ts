/** Lỗi do API trả về, giữ mã HTTP để nơi gọi phân biệt hết phiên (401), thiếu quyền (403)… */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const NO_CONTENT = 204;

async function readErrorMessage(response: Response): Promise<string> {
  try {
    const body: unknown = await response.json();
    if (
      typeof body === 'object' &&
      body !== null &&
      'error' in body &&
      typeof body.error === 'string'
    ) {
      return body.error;
    }
  } catch {
    // Phản hồi không phải JSON (vd lỗi mạng ở proxy): dùng thông báo chung bên dưới.
  }
  return `Máy chủ trả lỗi ${response.status}, vui lòng thử lại.`;
}

/**
 * Gọi API của chính ứng dụng. Kiểu trả về do nơi gọi khai báo theo hợp đồng của route tương ứng
 * trong `src/app/api`, vì cả hai đầu đều dùng chung kiểu trong `src/types`.
 */
export async function apiFetch<T>(
  path: string,
  method: HttpMethod = 'GET',
  body?: unknown,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers:
        body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      cache: 'no-store',
    });
  } catch {
    throw new ApiError(
      'Không kết nối được máy chủ, kiểm tra mạng rồi thử lại.',
      0,
    );
  }
  if (!response.ok) {
    throw new ApiError(await readErrorMessage(response), response.status);
  }
  if (response.status === NO_CONTENT) {
    return undefined as T;
  }
  return (await response.json()) as T;
}
