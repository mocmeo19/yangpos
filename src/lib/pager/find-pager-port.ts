/** Dùng cổng đầu tiên trình duyệt đã được cấp quyền; ứng dụng chỉ xin quyền cổng của đế phát. */
export async function findPagerPort(
  serial: Serial,
): Promise<SerialPort | null> {
  const ports = await serial.getPorts();
  return ports[0] ?? null;
}
