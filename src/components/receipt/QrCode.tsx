'use client';

import { useMemo } from 'react';
import { createQrMatrix } from '@/lib/qr/create-qr-matrix';

// Viền trắng quanh mã giúp ứng dụng ngân hàng nhận diện nhanh hơn.
const QUIET_ZONE_MODULES = 2;

interface QrCodeProps {
  payload: string;
  size: number;
  label: string;
}

export function QrCode({ payload, size, label }: QrCodeProps) {
  const { dimension, path } = useMemo(() => {
    const matrix = createQrMatrix(payload);
    const commands: string[] = [];
    for (let row = 0; row < matrix.size; row += 1) {
      for (let column = 0; column < matrix.size; column += 1) {
        if (matrix.isDark(row, column)) {
          commands.push(
            `M${column + QUIET_ZONE_MODULES} ${row + QUIET_ZONE_MODULES}h1v1h-1z`,
          );
        }
      }
    }
    return {
      dimension: matrix.size + QUIET_ZONE_MODULES * 2,
      path: commands.join(''),
    };
  }, [payload]);

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${dimension} ${dimension}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
    >
      <rect width={dimension} height={dimension} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
