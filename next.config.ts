import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Góc dưới bị thanh điều hướng trên điện thoại chiếm chỗ.
  devIndicators: { position: 'top-right' },
  partialPrefetching: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
