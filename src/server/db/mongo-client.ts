import 'server-only';
import { MongoClient, type Db } from 'mongodb';

interface MongoConfig {
  uri: string;
  dbName: string;
}

function readMongoConfig(): MongoConfig {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'Thiếu biến môi trường MONGODB_URI. Xem .env.example và chạy docker compose up -d.',
    );
  }
  return { uri, dbName: process.env.MONGODB_DB || 'yangpos' };
}

// Giữ một kết nối cho cả tiến trình; ở chế độ dev, hot reload nạp lại module nên phải cất lên globalThis.
const globalForMongo = globalThis as typeof globalThis & {
  yangposMongoClient?: Promise<MongoClient>;
};

export function getMongoClient(): Promise<MongoClient> {
  // Trường `undefined` (vd món không có mã vạch) được bỏ qua thay vì lưu thành `null`; muốn xóa
  // trường đã có thì dùng `$unset`.
  globalForMongo.yangposMongoClient ??= new MongoClient(readMongoConfig().uri, {
    ignoreUndefined: true,
  }).connect();
  return globalForMongo.yangposMongoClient;
}

export async function getMongoDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(readMongoConfig().dbName);
}
