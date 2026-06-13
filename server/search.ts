export type SearchHit = {
  title: string;
  url: string;
  snippet: string;
  rank: number;
};

const blacklist = /(login|free|apply-now|secure-login|verify-now|bonus|utm_|\/ads?|tracking)/i;
const priorityHost = /(\.gov\.in|\.edu|\.ac\.in|\.nic\.in|\.org|\.com)$/i;

function isValidUrl(value: unknown) {
  if (typeof value !== "string") return false;
  try {
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

function isSuspicious(value: string) {
  return blacklist.test(value);
}

function normalizeUrl(value: string) {
  try {
    return new URL(value.trim()).toString();
  } catch {
    return value.trim();
  }
}

export async function searchGoogle(query: string): Promise<SearchHit[]> {
  const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  const engineId = process.env.GOOGLE_SEARCH_ENGINE_ID;

  if (!apiKey || !engineId) {
    throw new Error("Google Search API credentials are not configured.");
  }

  const encodedQuery = encodeURIComponent(query.trim());
  const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(
    engineId,
  )}&q=${encodedQuery}&num=10`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Google Search API failure: ${body}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload.items) ? payload.items : [];

  const hits = items
    .map((item: any, index: number) => {
      const urlValue = String(item.link || item.formattedUrl || "").trim();
      return {
        title: String(item.title || item.htmlTitle || "Untitled result"),
        url: normalizeUrl(urlValue),
        snippet: String(item.snippet || item.htmlSnippet || ""),
        rank: index + 1,
      };
    })
    .filter((item) => item.url && isValidUrl(item.url) && !isSuspicious(item.url));

  return hits
    .sort((a, b) => {
      const aPriority = priorityHost.test(a.url) ? 0 : 1;
      const bPriority = priorityHost.test(b.url) ? 0 : 1;
      return aPriority - bPriority || a.rank - b.rank;
    })
    .slice(0, 10);
}
