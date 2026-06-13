import "dotenv/config";
import { createServer } from "http";
import { parse } from "url";
import { getBearerToken, verifyIdToken } from "./auth";
import { verifyTrustedBrowser } from "./trustedBrowser";
import { analyzeEligibility } from "./eligibility";
import { saveUserProfile, getUserProfile } from "./users";
import type { VerifiedUser } from "./auth";

const port = Number(process.env.BACKEND_PORT ?? 4000);

function sendJson(response: any, data: unknown, status = 200) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  response.end(JSON.stringify(data));
}

function parseBody(request: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk: Buffer) => {
      body += chunk.toString();
    });
    request.on("end", () => {
      if (!body) return resolve(null);
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

async function authenticate(request: any): Promise<VerifiedUser | null> {
  const bearer = getBearerToken(request.headers.authorization);
  return bearer ? verifyIdToken(bearer) : null;
}

const server = createServer(async (request, response) => {
  try {
    const url = parse(request.url || "", true);
    const method = request.method || "GET";

    if (method === "OPTIONS") {
      response.writeHead(204, {
        "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN || "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      return response.end();
    }

    if (url.pathname === "/api/trusted-browser" && (method === "GET" || method === "POST")) {
      const body = method === "POST" ? await parseBody(request) : null;
      const query = String(method === "GET" ? url.query.query : body?.searchQuery || "").trim();
      if (!query) {
        return sendJson(response, { error: "Query is required." }, 400);
      }

      const result = await verifyTrustedBrowser(query);
      return sendJson(response, result);
    }

    if (url.pathname === "/api/eligibility" && method === "POST") {
      const body = await parseBody(request);
      if (!body?.profile) {
        return sendJson(response, { error: "Profile is required." }, 400);
      }
      const user = await authenticate(request);
      const result = await analyzeEligibility(body.profile, user?.uid);
      return sendJson(response, result);
    }

    if (url.pathname === "/api/session" && method === "GET") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, { authenticated: false }, 200);
      }
      const profile = await getUserProfile(user.uid);
      return sendJson(response, { authenticated: true, user: profile || user });
    }

    if (url.pathname === "/api/users" && method === "POST") {
      const body = await parseBody(request);
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, { error: "Unauthorized." }, 401);
      }
      await saveUserProfile(user);
      return sendJson(response, { ok: true });
    }

    return sendJson(response, { error: "Not found." }, 404);
  } catch (error) {
    console.error(error);
    return sendJson(response, { error: "Server error." }, 500);
  }
});

server.listen(port, () => {
  console.log(`Backend server listening on http://localhost:${port}`);
});
