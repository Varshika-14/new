import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const queryInputSchema = z.object({
  query: z.string().min(1, "Query is required"),
  urls: z.array(z.string().url()),
});

export type UrlClassification =
  | "Official Website"
  | "Parent Organization Website"
  | "Subsidiary Website"
  | "Informational Website"
  | "Suspicious Website";

export type AuthenticityResult = {
  url: string;
  hostname: string;
  classification: UrlClassification;
  confidence: number;
  explanation: string;
  trustScore: number;
  reason: string;
  rank: number;
  flagged: boolean;
};

const trustedDomainPattern = /(gov\.in|nic\.in|india\.gov\.in|govt\.in)$/i;
const suspiciousPattern = /(free|instant|quick|apply|fast|download|official|grant|win|earn|money|registration|pm-scheme)/i;

function extractJson<T>(text: string): T | null {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function getRootDomain(hostname: string) {
  const parts = hostname.split(".").filter(Boolean);
  if (parts.length <= 2) return hostname;
  return parts.slice(-2).join(".");
}

function mapClassificationScore(value: UrlClassification) {
  switch (value) {
    case "Official Website":
      return 100;
    case "Parent Organization Website":
      return 92;
    case "Subsidiary Website":
      return 80;
    case "Informational Website":
      return 55;
    case "Suspicious Website":
      return 15;
    default:
      return 50;
  }
}

function getSearchRankScore(rank: number) {
  return Math.max(10, Math.round((11 - rank) * 10));
}

function getHttpsScore(url: string) {
  return url.startsWith("https://") ? 100 : 0;
}

function getDomainMatchScore(hostname: string, query: string) {
  if (trustedDomainPattern.test(hostname)) return 100;
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
  const brandTokens = normalizedQuery.split(/\s+/).filter(Boolean);
  const matches = brandTokens.filter((token) => token.length > 2 && hostname.includes(token));
  if (matches.length >= 2) return 90;
  if (matches.length === 1) return 70;
  if (suspiciousPattern.test(hostname)) return 20;
  return 40;
}

function getOrganizationMatchScore(hostname: string, query: string) {
  if (trustedDomainPattern.test(hostname)) return 100;
  const root = getRootDomain(hostname);
  const normalizedQuery = query.toLowerCase();
  if (root.includes(normalizedQuery) || normalizedQuery.includes(root.split(".")[0])) return 92;
  if (hostname.includes(normalizedQuery)) return 80;
  if (suspiciousPattern.test(hostname)) return 15;
  return 55;
}

function buildExplanation(classification: UrlClassification, hostname: string, query: string) {
  if (trustedDomainPattern.test(hostname)) {
    return `Official government portal detected by domain suffix and trusted India registry. ${hostname} is strongly associated with the search intent.`;
  }
  if (classification === "Official Website") {
    return `This site appears to be the official website for ${query}. Domain analysis and search ranking both point to legitimacy.`;
  }
  if (classification === "Suspicious Website") {
    return `The domain contains suspicious keywords or impersonation patterns and is not consistent with the official search intent.`;
  }
  return `The site appears related to the search intent but may not be the original official source. Proceed with caution.`;
}

async function classifyWithGemini(query: string, urls: string[]) {
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return urls.map((url) => ({ url, classification: "Informational Website" as UrlClassification, confidence: 60, explanation: "Gemini key not configured. Using heuristic fallback." }));
  }

  const prompt = `You are an internet authenticity verification expert. Query: "${query}". For each URL, determine:
1. Official Website
2. Parent Organization Website
3. Subsidiary Website
4. Informational Website
5. Suspicious Website

Return valid JSON array with objects: {"url", "classification", "confidence", "explanation"}. Use classification exactly as listed.`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta2/models/gemini-2.5-flash:generateText?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        prompt: { text: prompt + "\n\nURLs:\n" + urls.map((url) => `- ${url}`).join("\n") },
        temperature: 0.0,
        maxOutputTokens: 560,
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    console.error("Gemini authenticity request failed", text);
    return urls.map((url) => ({ url, classification: "Informational Website" as UrlClassification, confidence: 55, explanation: "Gemini request failed; using heuristic defaults." }));
  }

  const payload = await response.json();
  const output = payload?.candidates?.[0]?.output || payload?.output?.text || "";
  const parsed = extractJson<Array<{ url: string; classification: UrlClassification; confidence: number; explanation: string }>>(output);
  if (!parsed) {
    return urls.map((url) => ({ url, classification: "Informational Website" as UrlClassification, confidence: 55, explanation: "Gemini returned unexpected JSON. Using heuristic fallback." }));
  }

  return urls.map((url) => {
    const match = parsed.find((entry) => entry.url === url || entry.url === url.trim());
    if (match) {
      return {
        url: match.url,
        classification: match.classification,
        confidence: Math.min(100, Math.max(10, Math.round(match.confidence ?? 55))),
        explanation: match.explanation || buildExplanation(match.classification, getHostname(url), query),
      };
    }
    return {
      url,
      classification: "Informational Website" as UrlClassification,
      confidence: 55,
      explanation: "Gemini did not return a direct classification for this URL. Using heuristic fallback.",
    };
  });
}

export const verifySearchResults = createServerFn({ method: "POST" })
  .validator(queryInputSchema)
  .handler(async ({ data }) => {
    const normalizedQuery = data.query.trim();
    const urlClassifications = await classifyWithGemini(normalizedQuery, data.urls);

    return urlClassifications.map((classification, index) => {
      const hostname = getHostname(classification.url);
      const httpsScore = getHttpsScore(classification.url);
      const domainMatch = getDomainMatchScore(hostname, normalizedQuery);
      const orgMatch = getOrganizationMatchScore(hostname, normalizedQuery);
      const searchRank = getSearchRankScore(index + 1);
      const geminiConfidence = classification.confidence;
      const trustScore = Math.min(
        100,
        Math.round(
          domainMatch * 0.4 + httpsScore * 0.1 + orgMatch * 0.25 + searchRank * 0.15 + geminiConfidence * 0.1,
        ),
      );
      const serverReason = buildExplanation(classification.classification, hostname, normalizedQuery);
      return {
        url: classification.url,
        hostname,
        classification: classification.classification,
        confidence: classification.confidence,
        explanation: classification.explanation || serverReason,
        trustScore: trustedDomainPattern.test(hostname) ? 100 : trustScore,
        reason: trustedDomainPattern.test(hostname)
          ? "Official government portal detected by domain analysis."
          : classification.classification === "Suspicious Website"
          ? "Suspicious or deceptive domain patterns detected."
          : serverReason,
        rank: index + 1,
        flagged: trustedDomainPattern.test(hostname) ? false : trustScore < 80,
      };
    });
  });
