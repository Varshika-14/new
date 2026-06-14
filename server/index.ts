import "dotenv/config";
import { createServer } from "http";
import { parse } from "url";
import { getBearerToken, verifyIdToken } from "./auth";
import { verifyTrustedBrowser } from "./trustedBrowser";
import { analyzeEligibility } from "./eligibility";
import { saveUserProfile, getUserProfile } from "./users";
import { getDb } from "./db";
import { sendMail } from "./email";
import {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  bulkImportOpportunities,
  updateOpportunity,
  deleteOpportunity,
  verifyOpportunityUrl,
  getOpportunityStats,
} from "./opportunities";
import { externalAPI } from "./external-apis";
import type { VerifiedUser } from "./auth";

const port = Number(process.env.BACKEND_PORT ?? 4000);

async function initializeDatabase() {
  try {
    const db = await getDb();
    console.log("✅ Database connected successfully");
    console.log(`📊 Database name: ${db.databaseName}`);
  } catch (error) {
    console.warn("⚠️  Database connection failed - running without database");
    console.warn("Email and basic features will work, but user data features will be limited");
  }
}

function sendJson(response: any, request: any, data: unknown, status = 200) {
  response.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": request.headers.origin || process.env.FRONTEND_ORIGIN || "http://localhost:8080",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
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
        "Access-Control-Allow-Origin": request.headers.origin || process.env.FRONTEND_ORIGIN || "http://localhost:8080",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      });
      return response.end();
    }

    if (url.pathname === "/api/trusted-browser" && (method === "GET" || method === "POST")) {
      const body = method === "POST" ? await parseBody(request) : null;
      const query = String(method === "GET" ? url.query.query : body?.searchQuery || "").trim();
      if (!query) {
        return sendJson(response, request, { error: "Query is required." }, 400);
      }

      const result = await verifyTrustedBrowser(query);
      return sendJson(response, request, result);
    }

    if (url.pathname === "/api/eligibility" && method === "POST") {
      const body = await parseBody(request);
      if (!body?.profile) {
        return sendJson(response, request, { error: "Profile is required." }, 400);
      }
      const user = await authenticate(request);
      const result = await analyzeEligibility(body.profile, user?.uid);
      return sendJson(response, request, result);
    }

    if (url.pathname === "/api/session" && method === "GET") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { authenticated: false }, 200);
      }
      try {
        const profile = await getUserProfile(user.uid);
        return sendJson(response, request, { authenticated: true, user: profile || user });
      } catch (error) {
        return sendJson(response, request, { authenticated: true, user });
      }
    }

    if (url.pathname === "/api/users" && method === "POST") {
      const body = await parseBody(request);
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { error: "Unauthorized." }, 401);
      }
      try {
        await saveUserProfile(user);
      } catch (error) {
        console.warn("Failed to save user profile (database unavailable)");
      }
      return sendJson(response, request, { ok: true });
    }

    if (url.pathname === "/api/send-email" && method === "POST") {
      const body = await parseBody(request);
      if (!body?.email || !body?.message) {
        return sendJson(response, request, { error: "Email and message are required." }, 400);
      }
      await sendMail(body.email, "AshaAI Notification", `<h2>Hello!</h2><p>${body.message}</p>`);
      return sendJson(response, request, { success: true });
    }

    // Opportunity API endpoints
    if (url.pathname === "/api/opportunities" && method === "GET") {
      const query = url.query as any;
      const filter: any = {};
      if (query.category) filter.category = query.category;
      if (query.state) filter.state = query.state;
      if (query.educationLevel) filter.educationLevel = query.educationLevel;
      if (query.limit) filter.limit = parseInt(query.limit);
      
      const opportunities = await getOpportunities(filter);
      return sendJson(response, request, { opportunities, count: opportunities.length });
    }

    if (url.pathname === "/api/opportunities" && method === "POST") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { error: "Unauthorized." }, 401);
      }
      
      const body = await parseBody(request);
      if (!body) {
        return sendJson(response, request, { error: "Request body is required." }, 400);
      }
      
      // Single opportunity or bulk import
      if (Array.isArray(body)) {
        const result = await bulkImportOpportunities(body);
        return sendJson(response, request, { success: true, inserted: result.insertedCount });
      } else {
        const result = await createOpportunity(body);
        return sendJson(response, request, { success: true, id: result.insertedId });
      }
    }

    if (url.pathname?.startsWith("/api/opportunities/") && method === "GET") {
      const id = url.pathname.split("/").pop();
      const opportunity = await getOpportunityById(id!);
      if (!opportunity) {
        return sendJson(response, request, { error: "Opportunity not found." }, 404);
      }
      return sendJson(response, request, opportunity);
    }

    if (url.pathname?.startsWith("/api/opportunities/") && method === "PUT") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { error: "Unauthorized." }, 401);
      }
      
      const id = url.pathname.split("/").pop();
      const body = await parseBody(request);
      const result = await updateOpportunity(id!, body);
      return sendJson(response, request, { success: true, modified: result.modifiedCount });
    }

    if (url.pathname?.startsWith("/api/opportunities/") && method === "DELETE") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { error: "Unauthorized." }, 401);
      }
      
      const id = url.pathname.split("/").pop();
      const result = await deleteOpportunity(id!);
      return sendJson(response, request, { success: true, deleted: result.deletedCount });
    }

    if (url.pathname === "/api/opportunities/stats" && method === "GET") {
      const stats = await getOpportunityStats();
      return sendJson(response, request, stats);
    }

    if (url.pathname?.startsWith("/api/opportunities/") && url.pathname.endsWith("/verify") && method === "POST") {
      const id = url.pathname.split("/").slice(-2, -1)[0];
      const result = await verifyOpportunityUrl(id!);
      return sendJson(response, request, result);
    }

    // External API integration endpoints
    if (url.pathname === "/api/external/fetch" && method === "POST") {
      const user = await authenticate(request);
      if (!user) {
        return sendJson(response, request, { error: "Unauthorized." }, 401);
      }
      
      const body = await parseBody(request);
      const keyword = body?.keyword || "software";
      const category = body?.category || "All";
      const limit = body?.limit || 50;
      
      try {
        const opportunities = await externalAPI.searchOpportunities(keyword, category);
        const result = await externalAPI.importToDatabase(opportunities, "external-api");
        return sendJson(response, request, { 
          success: true, 
          fetched: opportunities.length,
          imported: result.insertedCount 
        });
      } catch (error) {
        console.error("External API fetch failed:", error);
        return sendJson(response, request, { error: "External API fetch failed." }, 500);
      }
    }

    if (url.pathname === "/api/external/internships" && method === "GET") {
      const query = url.query as any;
      const keyword = query.keyword || "software";
      const limit = parseInt(query.limit || "50");
      
      try {
        const opportunities = await externalAPI.fetchInternships(keyword, limit);
        return sendJson(response, request, { opportunities, count: opportunities.length });
      } catch (error) {
        console.error("Internship fetch failed:", error);
        return sendJson(response, request, { error: "Internship fetch failed." }, 500);
      }
    }

    return sendJson(response, request, { error: "Not found." }, 404);
  } catch (error) {
    console.error(error);
    return sendJson(response, request, { error: "Server error." }, 500);
  }
});

async function startServer() {
  await initializeDatabase();
  server.listen(port, () => {
    console.log(`Backend server listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
