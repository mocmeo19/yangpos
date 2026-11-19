function toHex(value: number): string {
  return value.toString(16).toUpperCase().padStart(4, '0');
}

/** Mã hãng:mã thiết bị USB giúp nhận ra đúng đế phát, vd "USB 1A86:7523" của chip CH340. */
export function describeSerialPort(port: SerialPort): string {
  const { usbVendorId, usbProductId } = port.getInfo();
  if (usbVendorId === undefined || usbProductId === undefined) {
    return 'Cổng COM';
  }
  return `USB ${toHex(usbVendorId)}:${toHex(usbProductId)}`;
}
