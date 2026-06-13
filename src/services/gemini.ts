import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const eligibilityProfileSchema = z.object({
  age: z.preprocess((val) => {
    if (typeof val === "string") return Number(val.replace(/[^0-9]/g, ""));
    return val;
  }, z.number().int().min(16, "Age must be at least 16").max(100, "Age must be 100 or younger")),
  income: z.preprocess((val) => {
    if (typeof val === "string") return Number(val.replace(/[^0-9.]/g, ""));
    return val;
  }, z.number().positive("Income must be greater than 0")),
  state: z.string().min(1, "State is required"),
  education: z.string().min(1, "Education is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Category is required"),
});

export type EligibilityProfile = z.infer<typeof eligibilityProfileSchema>;

export type SchemeRecommendation = {
  name: string;
  benefitAmount: string;
  matchScore: number;
  whyEligible: string;
  applyUrl: string;
};

export type EligibilityAnalysis = {
  schemes: SchemeRecommendation[];
  explanation: string;
  matchScore: number;
};

const fallbackSchemes: SchemeRecommendation[] = [
  {
    name: "National Scholarship Support",
    benefitAmount: "₹35,000",
    matchScore: 92,
    whyEligible: "Your education level and income profile are a strong fit for a centrally funded scholarship.",
    applyUrl: "https://scholarships.gov.in",
  },
  {
    name: "PM Internship Fellowship",
    benefitAmount: "₹12,000 / month",
    matchScore: 88,
    whyEligible: "Your technical education background makes you a good match for internship and training support programs.",
    applyUrl: "https://pminternship.mca.gov.in",
  },
  {
    name: "Skill India Stipend",
    benefitAmount: "₹8,000 / month",
    matchScore: 81,
    whyEligible: "Income-based eligibility and government support for youth skilling programs align well with your profile.",
    applyUrl: "https://skillindia.gov.in",
  },
];

function extractJson<T>(text: string): T | null {
  const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]) as T;
  } catch {
    return null;
  }
}

function normalizeExplanation(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.join(" ");
  return "Your profile was evaluated against government eligibility requirements and suitable schemes.";
}

export const analyzeEligibility = createServerFn({ method: "POST" })
  .validator(z.object({ profile: eligibilityProfileSchema }))
  .handler(async ({ data }) => {
    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const profile = data.profile;

    if (!apiKey) {
      return {
        schemes: fallbackSchemes,
        explanation: "Gemini API key is not configured. Showing fallback suggestions based on your profile.",
        matchScore: 82,
      } as EligibilityAnalysis;
    }

    const prompt = `You are an AI eligibility engine for Indian government schemes. Analyze this candidate profile and recommend government opportunities, explain eligibility, rank each opportunity, and generate an overall match score.

Profile:
- Age: ${profile.age}
- Annual income: ₹${profile.income}
- State: ${profile.state}
- Education: ${profile.education}
- Gender: ${profile.gender}

Return only valid JSON with keys: schemes, explanation, matchScore. Schemes should be an array of objects with name, benefitAmount, matchScore, whyEligible, applyUrl.
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
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
      const errorText = await response.text();
      console.error("Gemini eligibility request failed", errorText);
      return {
        schemes: fallbackSchemes,
        explanation: "Unable to reach Gemini eligibility engine. Showing fallback recommendations.",
        matchScore: 84,
      } as EligibilityAnalysis;
    }

    const dataJson = await response.json();
    const text =
      dataJson?.candidates?.[0]?.content?.[0]?.text ||
      dataJson?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ||
      dataJson?.candidates?.[0]?.output ||
      dataJson?.output?.text ||
      dataJson?.response?.payload?.text ||
      "";
    const parsed = extractJson<{
      schemes?: SchemeRecommendation[];
      explanation?: string;
      matchScore?: number;
    }>(text);

    if (!parsed || !Array.isArray(parsed.schemes)) {
      return {
        schemes: fallbackSchemes,
        explanation: normalizeExplanation(parsed?.explanation) ||
          "Gemini returned an unexpected response. Here are fallback recommendations.",
        matchScore: parsed?.matchScore ?? 83,
      } as EligibilityAnalysis;
    }

    const schemes = parsed.schemes.map((scheme) => ({
      name: String(scheme.name ?? "Untitled Scheme"),
      benefitAmount: String(scheme.benefitAmount ?? "₹0"),
      matchScore: Number(scheme.matchScore ?? 75),
      whyEligible: String(scheme.whyEligible ?? "This scheme matches your profile."),
      applyUrl: String(scheme.applyUrl ?? "https://scholarships.gov.in"),
    }));

    return {
      schemes: schemes.length ? schemes : fallbackSchemes,
      explanation: normalizeExplanation(parsed.explanation) ||
        "Gemini has analyzed your profile and recommended the best government opportunities.",
      matchScore: Number(parsed.matchScore ?? schemes[0]?.matchScore ?? 82),
    };
  });
