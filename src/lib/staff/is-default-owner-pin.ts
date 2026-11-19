import { DEFAULT_OWNER_PIN_CREDENTIAL } from '@/data/default-staff';
import type { PinCredential } from '@/types/staff';

/** Còn dùng PIN tạo sẵn lúc cài đặt thì cần nhắc đổi, vì PIN này ai cũng biết. */
export function isDefaultOwnerPin(pin: PinCredential): boolean {
  return (
    pin.salt === DEFAULT_OWNER_PIN_CREDENTIAL.salt &&
    pin.hash === DEFAULT_OWNER_PIN_CREDENTIAL.hash
  );
}
