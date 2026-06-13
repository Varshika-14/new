import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { getDb } from "../mongodb";

export const saveGoogleUser = createServerFn({ method: "POST" })
  .validator(
    z.object({
      uid: z.string().min(1),
      name: z.string().optional().nullable(),
      email: z.string().email().optional().nullable(),
      photo: z.string().url().optional().nullable(),
    }),
  )
  .handler(async ({ data }) => {
    const db = await getDb();

    await db.collection("users").updateOne(
      { uid: data.uid },
      {
        $setOnInsert: {
          uid: data.uid,
          createdAt: new Date(),
        },
        $set: {
          name: data.name ?? "",
          email: data.email ?? "",
          photo: data.photo ?? "",
          updatedAt: new Date(),
        },
      },
      { upsert: true },
    );

    return { ok: true };
  });
