'use client';

import { use, type ReactNode } from 'react';
import { browser } from 'react-dom';

/**
 * Dữ liệu POS được tải từ API sau khi vào trang, theo phiên đăng nhập và phiên nhân viên của từng
 * máy, nên bỏ qua prerender cho toàn bộ vùng dữ liệu.
 */
export function BrowserOnly({ children }: { children: ReactNode }) {
  use(browser('Dữ liệu POS được tải theo phiên của từng máy.'));
  return children;
}
