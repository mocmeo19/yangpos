export const PRINTER_PORT_RANGE = { min: 9100, max: 9109 } as const;

const MAX_OCTET = 255;

/** Chỉ nhận địa chỉ IPv4 thuộc dải mạng nội bộ: 10.x.x.x, 172.16–31.x.x, 192.168.x.x. */
export function isPrivateIpv4(host: string): boolean {
  const parts = host.split('.');
  if (parts.length !== 4 || !parts.every((part) => /^\d{1,3}$/.test(part))) {
    return false;
  }
  const octets = parts.map(Number);
  if (octets.some((octet) => octet > MAX_OCTET)) {
    return false;
  }
  const [first, second] = octets;
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
}

/**
 * Giới hạn IP nội bộ và cổng in thô (9100–9109) để server không bị lợi dụng gửi dữ liệu tới máy
 * hoặc dịch vụ khác ngoài máy in.
 */
export function getPrinterTargetError(
  host: string,
  port: number,
): string | null {
  if (!isPrivateIpv4(host.trim())) {
    return 'Nhập địa chỉ IP nội bộ của máy in, vd 192.168.1.100.';
  }
  const isPortInRange =
    Number.isInteger(port) &&
    port >= PRINTER_PORT_RANGE.min &&
    port <= PRINTER_PORT_RANGE.max;
  if (!isPortInRange) {
    return `Cổng máy in phải từ ${PRINTER_PORT_RANGE.min} đến ${PRINTER_PORT_RANGE.max} (thường là 9100).`;
  }
  return null;
}
