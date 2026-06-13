import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  query: z.string().min(1),
});

export type VerificationResult = {
  organization: string;
  officialWebsite: string;
  confidence: number;
  reason: string;
};

const suspiciousKeywords = [
  "login",
  "free",
  "apply-now",
  "secure-login",
  "verify-now",
  "bonus",
];

function clampConfidence(value: number) {
  return Number.isFinite(value) ? Math.min(100, Math.max(0, Math.round(value))) : 0;
}

function extractJsonObject(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i += 1) {
    const char = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (char === "\\") {
      escape = true;
      continue;
    }

    if (char === '"') {
      inString = !inString;
      continue;
    }

    if (inString) {
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function parseSafeJson<T>(text: string): T | null {
  const jsonBlock = extractJsonObject(text);
  if (!jsonBlock) return null;

  try {
    return JSON.parse(jsonBlock) as T;
  } catch {
    return null;
  }
}

function normalizeUrl(rawUrl: unknown): string {
  if (typeof rawUrl !== "string") return "";

  const trimmed = rawUrl.trim();
  if (!trimmed) return "";

  const prefixed = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(prefixed);
    return url.toString();
  } catch {
    return "";
  }
}

function isSuspiciousWebsite(url: string): boolean {
  const normalized = url.toLowerCase();
  return suspiciousKeywords.some((keyword) => normalized.includes(keyword));
}

function getResultFromRaw(
  raw: unknown,
  query: string,
): VerificationResult {
  const organization = typeof raw === "object" && raw !== null && "organization" in raw && typeof (raw as any).organization === "string"
    ? (raw as any).organization.trim() || query
    : query;

  const officialWebsite = normalizeUrl(
    typeof raw === "object" && raw !== null && "officialWebsite" in raw && typeof (raw as any).officialWebsite === "string"
      ? (raw as any).officialWebsite.trim()
      : "",
  );

  let confidence = clampConfidence(
    typeof raw === "object" && raw !== null && "confidence" in raw && typeof (raw as any).confidence === "number"
      ? (raw as any).confidence
      : 0,
  );

  const reason = typeof raw === "object" && raw !== null && "reason" in raw && typeof (raw as any).reason === "string"
    ? (raw as any).reason.trim()
    : "The Trusted Browser analyzed the query and evaluated the official source.";

  if (!officialWebsite) {
    return {
      organization,
      officialWebsite: "",
      confidence: 0,
      reason: "Verification service could not determine a safe official website for this query.",
    };
  }

  if (isSuspiciousWebsite(officialWebsite)) {
    confidence = Math.max(0, confidence - 30);
  }

  const finalConfidence = clampConfidence(confidence);

  return {
    organization,
    officialWebsite,
    confidence: finalConfidence,
    reason: finalConfidence < 70
      ? `${reason} This source may not be fully verified.`
      : reason,
  };
}

export const verifyWebsite = createServerFn({ method: "POST" })
  .validator(schema)
  .handler(async ({ data }) => {
    console.log("🔥 Trusted Browser API HIT");
    console.log("REQUEST QUERY:", data.query);
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("🔥 GEMINI KEY EXISTS:", !!apiKey);

    if (!apiKey) {
      return {
        organization: data.query,
        officialWebsite: "",
        confidence: 0,
        reason: "Verification service unavailable",
      } as VerificationResult;
    }

    const prompt = `You are AshaAI Trusted Browser.

Your job is to identify ONLY the official website for a query.

Rules:
- Return ONLY one official website.
- Do NOT hallucinate URLs.
- If unsure, return confidence < 50 and empty website.
- Never return fake, affiliate, or phishing sites.
- Only return widely recognized official domains.

Return ONLY valid JSON:
{
  "organization": "",
  "officialWebsite": "",
  "confidence": 0,
  "reason": ""
}

Query: ${data.query}
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        },
      );

      if (!response.ok) {
        return {
          organization: data.query,
          officialWebsite: "",
          confidence: 0,
          reason: "Verification service unavailable",
        };
      }

      const result = await response.json();
      console.log("GEMINI RAW RESPONSE:", result);
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

      const parsed = parseSafeJson<VerificationResult>(String(text));
      if (!parsed) {
        return {
          organization: data.query,
          officialWebsite: "",
          confidence: 0,
          reason: "Verification service unavailable",
        };
      }

      return getResultFromRaw(parsed, data.query);
    } catch (error) {
      return {
        organization: data.query,
        officialWebsite: "",
        confidence: 0,
        reason: "Verification service unavailable",
      };
    }
  });
