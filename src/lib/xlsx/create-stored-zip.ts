import { concatBytes } from '@/lib/bytes/concat-bytes';
import type { ZipEntry } from '@/types/zip-entry';
import { crc32 } from './crc32';

// Bố cục theo đặc tả ZIP của PKWARE (APPNOTE.TXT); mọi số nguyên ghi theo thứ tự little-endian.
const LOCAL_HEADER_SIGNATURE = 0x04034b50;
const CENTRAL_HEADER_SIGNATURE = 0x02014b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const LOCAL_HEADER_SIZE = 30;
const CENTRAL_HEADER_SIZE = 46;
const END_OF_CENTRAL_DIRECTORY_SIZE = 22;
const VERSION_NEEDED = 20;
const UTF8_NAME_FLAG = 0x0800;
const STORED_METHOD = 0;

interface PreparedEntry {
  name: Uint8Array;
  data: Uint8Array;
  crc: number;
  offset: number;
}

interface DosTimestamp {
  time: number;
  date: number;
}

function toDosTimestamp(date: Date): DosTimestamp {
  return {
    time:
      (date.getHours() << 11) |
      (date.getMinutes() << 5) |
      Math.floor(date.getSeconds() / 2),
    date:
      ((date.getFullYear() - 1980) << 9) |
      ((date.getMonth() + 1) << 5) |
      date.getDate(),
  };
}

function writeLocalHeader(
  entry: PreparedEntry,
  timestamp: DosTimestamp,
): Uint8Array {
  const header = new Uint8Array(LOCAL_HEADER_SIZE + entry.name.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, LOCAL_HEADER_SIGNATURE, true);
  view.setUint16(4, VERSION_NEEDED, true);
  view.setUint16(6, UTF8_NAME_FLAG, true);
  view.setUint16(8, STORED_METHOD, true);
  view.setUint16(10, timestamp.time, true);
  view.setUint16(12, timestamp.date, true);
  view.setUint32(14, entry.crc, true);
  view.setUint32(18, entry.data.length, true);
  view.setUint32(22, entry.data.length, true);
  view.setUint16(26, entry.name.length, true);
  header.set(entry.name, LOCAL_HEADER_SIZE);
  return header;
}

function writeCentralHeader(
  entry: PreparedEntry,
  timestamp: DosTimestamp,
): Uint8Array {
  const header = new Uint8Array(CENTRAL_HEADER_SIZE + entry.name.length);
  const view = new DataView(header.buffer);
  view.setUint32(0, CENTRAL_HEADER_SIGNATURE, true);
  view.setUint16(4, VERSION_NEEDED, true);
  view.setUint16(6, VERSION_NEEDED, true);
  view.setUint16(8, UTF8_NAME_FLAG, true);
  view.setUint16(10, STORED_METHOD, true);
  view.setUint16(12, timestamp.time, true);
  view.setUint16(14, timestamp.date, true);
  view.setUint32(16, entry.crc, true);
  view.setUint32(20, entry.data.length, true);
  view.setUint32(24, entry.data.length, true);
  view.setUint16(28, entry.name.length, true);
  view.setUint32(42, entry.offset, true);
  header.set(entry.name, CENTRAL_HEADER_SIZE);
  return header;
}

function writeEndOfCentralDirectory(
  entryCount: number,
  directorySize: number,
  directoryOffset: number,
): Uint8Array {
  const record = new Uint8Array(END_OF_CENTRAL_DIRECTORY_SIZE);
  const view = new DataView(record.buffer);
  view.setUint32(0, END_OF_CENTRAL_DIRECTORY_SIGNATURE, true);
  view.setUint16(8, entryCount, true);
  view.setUint16(10, entryCount, true);
  view.setUint32(12, directorySize, true);
  view.setUint32(16, directoryOffset, true);
  return record;
}

/** Đóng gói ZIP không nén: đủ cho tệp Excel vài trăm KB mà không cần thêm thư viện nén. */
export function createStoredZip(
  entries: readonly ZipEntry[],
  modifiedAt: Date = new Date(),
): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const timestamp = toDosTimestamp(modifiedAt);
  const fileParts: Uint8Array[] = [];
  const prepared: PreparedEntry[] = [];
  let offset = 0;
  for (const entry of entries) {
    const item: PreparedEntry = {
      name: encoder.encode(entry.path),
      data: entry.data,
      crc: crc32(entry.data),
      offset,
    };
    const localHeader = writeLocalHeader(item, timestamp);
    fileParts.push(localHeader, item.data);
    offset += localHeader.length + item.data.length;
    prepared.push(item);
  }
  const centralHeaders = prepared.map((item) =>
    writeCentralHeader(item, timestamp),
  );
  const directorySize = centralHeaders.reduce(
    (sum, header) => sum + header.length,
    0,
  );
  return concatBytes([
    ...fileParts,
    ...centralHeaders,
    writeEndOfCentralDirectory(prepared.length, directorySize, offset),
  ]);
}
