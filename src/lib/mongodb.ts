import { MongoClient } from "mongodb";

const uri = import.meta.env.VITE_MONGODB_URI ?? process.env.MONGODB_URI!;

const client = new MongoClient(uri);

export async function getDb() {
  await client.connect();
  return client.db("ashaai");
}
