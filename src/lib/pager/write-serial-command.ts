// Một cổng chỉ mở được một lần: các lệnh gọi liền nhau (vd bếp báo xong hai đơn) phải xếp hàng.
let previousWrite: Promise<void> = Promise.resolve();

async function openWriteClose(
  port: SerialPort,
  baudRate: number,
  data: Uint8Array,
): Promise<void> {
  try {
    await port.open({ baudRate });
  } catch (cause) {
    throw new Error(
      'Không mở được cổng của đế phát. Kiểm tra dây cáp và đóng phần mềm khác đang dùng cổng.',
      { cause },
    );
  }
  try {
    const writer = port.writable?.getWriter();
    if (!writer) {
      throw new Error('Cổng của đế phát không cho ghi dữ liệu.');
    }
    try {
      await writer.write(data);
      // Đóng luồng ghi để chắc dữ liệu đã đi hết trước khi đóng cổng.
      await writer.close();
    } finally {
      writer.releaseLock();
    }
  } finally {
    await port.close();
  }
}

/** Mở cổng, gửi lệnh rồi đóng ngay để không giữ cổng khi không dùng. */
export function writeSerialCommand(
  port: SerialPort,
  baudRate: number,
  data: Uint8Array,
): Promise<void> {
  const write = previousWrite.then(() => openWriteClose(port, baudRate, data));
  previousWrite = write.catch(() => undefined);
  return write;
}
