import 'server-only';
import { Socket } from 'node:net';

const SOCKET_TIMEOUT_MS = 5000;

/** Gửi dữ liệu in thô qua TCP rồi đóng kết nối; luôn hủy socket khi lỗi hoặc quá thời gian chờ. */
export function sendRawToPrinter(
  host: string,
  port: number,
  data: Uint8Array,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const socket = new Socket();

    function fail(error: Error) {
      socket.destroy();
      reject(error);
    }

    socket.setTimeout(SOCKET_TIMEOUT_MS, () =>
      fail(new Error(`Máy in ${host}:${port} không phản hồi.`)),
    );
    socket.once('error', (cause) =>
      fail(new Error(`Không kết nối được máy in ${host}:${port}.`, { cause })),
    );
    socket.connect(port, host, () => {
      socket.end(data, () => resolve());
    });
  });
}
