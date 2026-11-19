import { mutate } from 'swr';

/**
 * Tải lại mọi dữ liệu đang hiển thị có đường dẫn API bắt đầu bằng một trong các tiền tố, vd sau khi
 * thanh toán thì danh sách đơn, báo cáo và sổ quỹ đều cập nhật theo.
 */
export async function revalidateApi(...prefixes: string[]): Promise<void> {
  await mutate(
    (key) =>
      typeof key === 'string' &&
      prefixes.some((prefix) => key.startsWith(prefix)),
  );
}
