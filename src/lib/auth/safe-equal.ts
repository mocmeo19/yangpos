import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * So sánh trong thời gian không phụ thuộc nội dung để không dò được mật khẩu hay chữ ký qua thời
 * gian phản hồi. Băm trước để hai vế luôn cùng độ dài như `timingSafeEqual` yêu cầu.
 */
export function safeEqual(left: string, right: string): boolean {
  const leftDigest = createHash('sha256').update(left).digest();
  const rightDigest = createHash('sha256').update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}
