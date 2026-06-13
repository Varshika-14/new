import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { expandQuery, getCategoryQueries, getStateQueries } from "@/lib/ai/queryExpander";

export type SearchResult = {
  title: string;
  link: string;
  snippet: string;
  rank: number;
};

const searchInputSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  state: z.string().optional(),
});

function isValidGovLink(url: string): boolean {
  return (
    url.includes(".gov.in") ||
    url.includes(".nic.in") ||
    url.includes("india.gov") ||
    url.includes("gov.bharat") ||
    url.includes("rbi.org.in") ||
    url.startsWith("https")
  );
}

export const searchGoogle = createServerFn({ method: "POST" })
  .validator(searchInputSchema)
  .handler(async ({ data }) => {
    const apiKey = process.env.VITE_GOOGLE_SEARCH_API_KEY || process.env.GOOGLE_SEARCH_API_KEY;
    const engineId = process.env.VITE_GOOGLE_SEARCH_ENGINE_ID || process.env.GOOGLE_SEARCH_ENGINE_ID;
    if (!apiKey || !engineId) {
      throw new Error("Google Search API credentials are not configured.");
    }

    // Generate expanded queries based on input
    let queries: string[] = [];
    
    if (data.category && data.category !== "All") {
      if (data.state && data.state !== "All India") {
        queries = getStateQueries(data.state, data.category);
      } else {
        queries = getCategoryQueries(data.category);
      }
    } else if (data.query) {
      queries = expandQuery(data.query);
    } else {
      // Default broad search if no specific query
      queries = [
        "government scheme india",
        "scholarship apply india",
        "fellowship programme india",
        "startup grant india",
        "internship government india",
        "skill development scheme",
      ];
    }

    const allResults: any[] = [];

    // Execute multiple queries in parallel
    const searchPromises = queries.map(async (q) => {
      const query = encodeURIComponent(q.trim());
      const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(apiKey)}&cx=${encodeURIComponent(engineId)}&q=${query}&num=10`;

      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(`Google Search API failure for query: ${q}`);
          return [];
        }

        const payload = await response.json();
        const items = Array.isArray(payload.items) ? payload.items : [];

        return items.map((item: any) => ({
          title: item.title || item.htmlTitle || "Unknown result",
          link: String(item.link || item.formattedUrl || ""),
          snippet: String(item.snippet || item.htmlSnippet || ""),
        }));
      } catch (error) {
        console.error(`Error fetching results for query: ${q}`, error);
        return [];
      }
    });

    const resultsArrays = await Promise.all(searchPromises);
    resultsArrays.forEach(results => allResults.push(...results));

    // Remove duplicates based on URL
    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [item.link, item])).values()
    );

    // Filter for government links only
    const govResults = uniqueResults.filter((item) => isValidGovLink(item.link));

    // Rank and limit results
    const rankedResults = govResults
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }))
      .slice(0, 50); // Return up to 50 results

    return rankedResults;
  });
