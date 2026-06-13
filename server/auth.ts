import admin from "firebase-admin";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

if (!projectId || !clientEmail || !privateKey) {
  console.warn("Firebase admin credentials are not fully configured. Auth verification will fail until FIREBASE_ADMIN_* env values are provided.");
}

if (!admin.apps.length && projectId && clientEmail && privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, "\n"),
    }),
  });
}

export type VerifiedUser = {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
};

export async function verifyIdToken(token?: string): Promise<VerifiedUser | null> {
  if (!token) return null;
  if (!admin.apps.length) {
    throw new Error("Firebase admin is not initialized. Provide FIREBASE_ADMIN_* credentials.");
  }

  const decoded = await admin.auth().verifyIdToken(token);
  return {
    uid: decoded.uid,
    email: decoded.email ?? undefined,
    name: decoded.name ?? undefined,
    picture: decoded.picture ?? undefined,
  };
}

export function getBearerToken(authHeader?: string): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
