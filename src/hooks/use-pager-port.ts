'use client';

import { useCallback, useEffect, useState } from 'react';
import { describeSerialPort } from '@/lib/pager/describe-serial-port';
import { findPagerPort } from '@/lib/pager/find-pager-port';
import {
  getSerialApi,
  SERIAL_UNSUPPORTED_MESSAGE,
} from '@/lib/pager/get-serial-api';

export interface PagerPortState {
  isSupported: boolean;
  /** Mô tả cổng đã được cấp quyền, `null` khi chưa kết nối. */
  portLabel: string | null;
  /** Mở hộp chọn cổng của trình duyệt; trả về `false` khi người dùng bấm hủy. */
  connect: () => Promise<boolean>;
}

function isUserCancellation(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'NotFoundError';
}

/** Theo dõi cổng USB/COM của đế phát, tự cập nhật khi cắm hoặc rút cáp. */
export function usePagerPort(): PagerPortState {
  const serial = getSerialApi();
  const [portLabel, setPortLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!serial) {
      return;
    }
    const serialApi = serial;
    let isCurrent = true;
    async function refresh() {
      const port = await findPagerPort(serialApi);
      if (isCurrent) {
        setPortLabel(port ? describeSerialPort(port) : null);
      }
    }
    void refresh();
    serialApi.addEventListener('connect', refresh);
    serialApi.addEventListener('disconnect', refresh);
    return () => {
      isCurrent = false;
      serialApi.removeEventListener('connect', refresh);
      serialApi.removeEventListener('disconnect', refresh);
    };
  }, [serial]);

  const connect = useCallback(async () => {
    if (!serial) {
      throw new Error(SERIAL_UNSUPPORTED_MESSAGE);
    }
    try {
      const port = await serial.requestPort();
      setPortLabel(describeSerialPort(port));
      return true;
    } catch (error) {
      if (isUserCancellation(error)) {
        return false;
      }
      throw error;
    }
  }, [serial]);

  return { isSupported: serial !== null, portLabel, connect };
}
