import { z } from "zod";

export const eligibilityProfileSchema = z.object({
  age: z.number().int().min(16, "Age must be at least 16"),
  income: z.number().min(1, "Income must be greater than 0"),
  state: z.string().min(1, "State is required"),
  education: z.string().min(1, "Education is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Category is required"),
});

export type EligibilityProfile = z.infer<typeof eligibilityProfileSchema>;

export type EligibilityOpportunity = {
  schemeName: string;
  matchScore: number;
  benefitAmount: string;
  whyEligible: string;
  officialApplyLink: string;
};

export type EligibilityAnalysis = {
  opportunities: EligibilityOpportunity[];
  explanation: string;
  matchScore: number;
};

export type TrustedBrowserResult = {
  title: string;
  url: string;
  snippet: string;
  trustScore: number;
  isVerified: boolean;
  reason: string;
  organization: string;
};

export type UserSession = {
  uid: string;
  name?: string;
  email?: string;
  picture?: string;
};
