import { getCollection } from "./db";
import { VerifiedUser } from "./auth";

export async function saveUserProfile(user: VerifiedUser) {
  const collection = await getCollection("users");
  await collection.updateOne(
    { uid: user.uid },
    {
      $setOnInsert: {
        uid: user.uid,
        createdAt: new Date(),
      },
      $set: {
        name: user.name || "",
        email: user.email || "",
        picture: user.picture || "",
        updatedAt: new Date(),
      },
    },
    { upsert: true },
  );
  return { ok: true };
}

export async function getUserProfile(uid: string) {
  const collection = await getCollection("users");
  return collection.findOne({ uid });
}
