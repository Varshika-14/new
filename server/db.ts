import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI must be set for the backend server.");
}

const client = new MongoClient(uri);
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    db = client.db(process.env.MONGODB_DB_NAME || "ashaai");
  }
  return db;
}

export async function getCollection<T = any>(name: string) {
  return (await getDb()).collection<T>(name);
}
