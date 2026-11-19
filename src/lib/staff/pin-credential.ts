import { base64ToBytes } from '@/lib/bytes/base64-to-bytes';
import { bytesToBase64 } from '@/lib/bytes/bytes-to-base64';
import type { PinCredential } from '@/types/staff';

// Phải khớp với tham số đã dùng để tính sẵn PIN mặc định trong default-staff.ts.
const PBKDF2_ITERATIONS = 100_000;
const HASH_BITS = 256;
const SALT_BYTES = 16;

async function derivePinHash(
  pin: string,
  salt: Uint8Array<ArrayBuffer>,
): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pin),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PBKDF2_ITERATIONS },
    key,
    HASH_BITS,
  );
  return bytesToBase64(new Uint8Array(bits));
}

export async function createPinCredential(pin: string): Promise<PinCredential> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  return { salt: bytesToBase64(salt), hash: await derivePinHash(pin, salt) };
}

export async function verifyPin(
  pin: string,
  credential: PinCredential,
): Promise<boolean> {
  const hash = await derivePinHash(pin, base64ToBytes(credential.salt));
  return hash === credential.hash;
}
