import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = uri ? new MongoClient(uri) : null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (!db) {
    if (!client) {
      throw new Error("MongoDB not configured. Set MONGODB_URI in .env");
    }
    try {
      await client.connect();
      db = client.db(process.env.MONGODB_DB_NAME || "ashaai");
    } catch (error) {
      console.error("MongoDB connection failed:", error);
      throw new Error("Failed to connect to MongoDB. Check your network and MONGODB_URI.");
    }
  }
  return db;
}

export async function getCollection<T = any>(name: string) {
  return (await getDb()).collection<T>(name);
}
