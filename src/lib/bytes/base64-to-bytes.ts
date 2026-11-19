export function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(atob(base64), (character) => character.charCodeAt(0));
}
