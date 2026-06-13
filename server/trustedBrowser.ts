import { callGemini } from "./gemini";
import { searchGoogle } from "./search";
import { TrustedBrowserResult } from "../src/shared/types";

function clampScore(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)));
}

export async function verifyTrustedBrowser(query: string): Promise<TrustedBrowserResult> {
  const hits = await searchGoogle(query);

  if (!hits.length) {
    return {
      title: "No results found",
      url: "",
      snippet: "No valid official website could be found for this query.",
      trustScore: 0,
      isVerified: false,
      reason: "Search did not return any safe, verified links.",
      organization: query,
    };
  }

  const prompt = `You are AshaAI Trusted Browser. Identify the official website for the following query and return only valid JSON.

Query: ${query}

Search results:
${hits.map((hit) => `- ${hit.url}`).join("\n")}

Return JSON:
{
  "organization": "",
  "officialWebsite": "",
  "confidence": 0,
  "reason": ""
}

Rules:
- Return only one official website.
- Do not hallucinate URLs.
- Prefer government, educational, and known brand domains.
- If unsure, use a low confidence and return an empty website.
`;

  const official = await callGemini<{ organization: string; officialWebsite: string; confidence: number; reason: string }>(prompt);
  const title = hits[0].title;
  const url = official.officialWebsite || hits[0].url;
  const snippet = hits[0].snippet;
  const trustScore = clampScore(official.confidence || 0);
  const isVerified = Boolean(official.officialWebsite && trustScore >= 70);

  return {
    title,
    url,
    snippet,
    trustScore,
    isVerified,
    reason: official.reason || "Verified using Google Search and Gemini analysis.",
    organization: official.organization || query,
  };
}
