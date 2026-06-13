import { z } from "zod";
import { callGemini } from "./gemini";
import { getCollection } from "./db";
import { EligibilityAnalysis, EligibilityOpportunity, EligibilityProfile } from "../src/shared/types";

export const eligibilitySchema = z.object({
  age: z.number().int().min(16, "Age must be at least 16"),
  income: z.number().min(1, "Income must be greater than 0"),
  state: z.string().min(1, "State is required"),
  education: z.string().min(1, "Education is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Category is required"),
});

const fallbackOpportunities: EligibilityOpportunity[] = [
  {
<<<<<<< HEAD
    name: "National Scholarship Support",
    benefitAmount: "₹35,000",
    eligibilityReason: "Your education level and income profile match central scholarship support criteria.",
    applyUrl: "https://scholarships.gov.in",
    matchScore: 92,
  },
  {
    name: "PM Internship Fellowship",
    benefitAmount: "₹12,000 / month",
    eligibilityReason: "Your profile matches technical internship and youth training programs.",
    applyUrl: "https://pminternship.mca.gov.in",
    matchScore: 88,
  },
  {
    name: "Skill India Stipend",
    benefitAmount: "₹8,000 / month",
    eligibilityReason: "Your income and education fit youth skilling program support.",
    applyUrl: "https://skillindia.gov.in",
    matchScore: 81,
=======
    schemeName: "National Scholarship Support",
    matchScore: 92,
    benefitAmount: "₹35,000",
    whyEligible: "Your education level and income profile match central scholarship support criteria.",
    officialApplyLink: "https://scholarships.gov.in",
  },
  {
    schemeName: "PM Internship Fellowship",
    matchScore: 88,
    benefitAmount: "₹12,000 / month",
    whyEligible: "Your profile matches technical internship and youth training programs.",
    officialApplyLink: "https://pminternship.mca.gov.in",
  },
  {
    schemeName: "Skill India Stipend",
    matchScore: 81,
    benefitAmount: "₹8,000 / month",
    whyEligible: "Your income and education fit youth skilling program support.",
    officialApplyLink: "https://skillindia.gov.in",
>>>>>>> origin/tej-code
  },
];

function normalizeOpportunities(items: unknown): EligibilityOpportunity[] {
  if (!Array.isArray(items)) return [];
  return items
    .slice(0, 10)
    .map((item) => {
      const candidate = item as any;
      return {
<<<<<<< HEAD
        name: String(candidate.name ?? "Untitled Opportunity"),
        benefitAmount: String(candidate.benefitAmount ?? "₹0"),
        eligibilityReason: String(candidate.eligibilityReason ?? candidate.whyEligible ?? "This opportunity matches your profile."),
        applyUrl: String(candidate.applyUrl ?? "https://scholarships.gov.in"),
        matchScore: Number(candidate.matchScore ?? 75),
      };
    })
    .filter((item) => item.name && item.applyUrl);
=======
        schemeName: String(candidate.schemeName ?? candidate.name ?? "Untitled Opportunity"),
        matchScore: Number(candidate.matchScore ?? 75),
        benefitAmount: String(candidate.benefitAmount ?? "₹0"),
        whyEligible: String(candidate.whyEligible ?? candidate.eligibilityReason ?? "This opportunity matches your profile."),
        officialApplyLink: String(candidate.officialApplyLink ?? candidate.applyUrl ?? "https://scholarships.gov.in"),
      };
    })
    .filter((item) => item.schemeName && item.officialApplyLink);
>>>>>>> origin/tej-code
}

export async function analyzeEligibility(profile: EligibilityProfile, userId?: string): Promise<EligibilityAnalysis> {
  const validated = eligibilitySchema.parse(profile);

  const prompt = `You are an AI eligibility engine for Indian government opportunities. Analyze the profile and return 5 to 10 matching opportunities.

Profile:
- Age: ${validated.age}
- Annual income: ₹${validated.income}
- State: ${validated.state}
- Education: ${validated.education}
- Gender: ${validated.gender}
- Category: ${validated.category}

Return only valid JSON:
{
  "opportunities": [
    {
<<<<<<< HEAD
      "name": "",
      "benefitAmount": "",
      "eligibilityReason": "",
      "applyUrl": "",
      "matchScore": 0
=======
      "schemeName": "",
      "matchScore": 0,
      "benefitAmount": "",
      "whyEligible": "",
      "officialApplyLink": ""
>>>>>>> origin/tej-code
    }
  ],
  "explanation": "",
  "matchScore": 0
}

Rules:
- Include scholarships, internships, government schemes, and skills programs.
- Provide 5 to 10 opportunities.
- Do not invent government or official portal URLs.
<<<<<<< HEAD
=======
- Use real, official government websites for apply links.
>>>>>>> origin/tej-code
`;

  try {
    const parsed = await callGemini<{ opportunities?: unknown; explanation?: string; matchScore?: number }>(prompt);
    const opportunities = normalizeOpportunities(parsed.opportunities);
    const result: EligibilityAnalysis = {
      opportunities: opportunities.length >= 5 ? opportunities : fallbackOpportunities,
      explanation: String(parsed.explanation || "The model analysed your profile and recommended the best opportunities."),
      matchScore: Number(parsed.matchScore ?? opportunities[0]?.matchScore ?? 82),
    };

    if (userId) {
      const collection = await getCollection("eligibilityHistory");
      await collection.insertOne({
        userId,
        profile: validated,
        result,
        createdAt: new Date(),
      });
    }

    return result;
  } catch (error) {
    return {
      opportunities: fallbackOpportunities,
      explanation: "Unable to reach the eligibility engine. Showing fallback recommendations.",
      matchScore: 82,
    };
  }
}
