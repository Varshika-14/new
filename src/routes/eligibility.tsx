import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { eligibilityProfileSchema, type EligibilityProfile, type SchemeRecommendation } from "@/shared/types";

export const Route = createFileRoute("/eligibility")({
  head: () => ({ meta: [{ title: "AI Eligibility Checker — AshaAI" }] }),
  component: EligibilityPage,
});

const eligibilitySchema = eligibilityProfileSchema.extend({
  category: z.string().min(1, "Category is required"),
});

type FormValues = z.infer<typeof eligibilitySchema>;

const defaultValues: FormValues = {
  state: "Andhra Pradesh",
  age: 20,
  gender: "Male",
  income: 250000,
  education: "Undergraduate",
  category: "General",
};

const stateOptions = ["Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Maharashtra", "All India"];
const genderOptions = ["Male", "Female", "Other"];
const educationOptions = ["School", "Undergraduate", "Graduate", "Postgraduate"];
const categoryOptions = ["General", "OBC", "SC", "ST", "EWS"];

function EligibilityPage() {
  const [analysis, setAnalysis] = useState<{ schemes: SchemeRecommendation[]; explanation: string; matchScore: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(eligibilitySchema),
    defaultValues,
    mode: "onTouched",
  });

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setIsLoading(true);
    setAnalysis(null);

    try {
      const token = localStorage.getItem("idToken");
      const response = await window.fetch("/api/eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ profile: values }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to analyse eligibility right now.");
      }
      setAnalysis(result);
    } catch (error) {
      console.error(error);
      setSubmitError((error as Error).message || "Unable to analyse eligibility right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const errors = form.formState.errors;

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <header>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">AI Eligibility</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find government schemes you qualify for</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Enter your profile details and AshaAI will analyse eligibility, rank matching schemes, and explain why you qualify.
          </p>
        </header>

        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-3xl bg-card ring-1 ring-black/5 p-6 md:p-8 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">State</span>
              <select
                {...form.register("state")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {stateOptions.map((state) => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              {errors.state && <p className="text-sm text-destructive mt-2">{errors.state.message}</p>}
            </label>

            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Age</span>
              <Input type="number" min={16} max={100} {...form.register("age", { valueAsNumber: true })} />
              {errors.age && <p className="text-sm text-destructive mt-2">{errors.age.message}</p>}
            </label>

            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Gender</span>
              <select
                {...form.register("gender")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>{gender}</option>
                ))}
              </select>
              {errors.gender && <p className="text-sm text-destructive mt-2">{errors.gender.message}</p>}
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Annual income (₹)</span>
              <Input type="number" min={1} step={1000} {...form.register("income", { valueAsNumber: true })} />
              {errors.income && <p className="text-sm text-destructive mt-2">{errors.income.message}</p>}
            </label>

            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Education</span>
              <select
                {...form.register("education")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {educationOptions.map((education) => (
                  <option key={education} value={education}>{education}</option>
                ))}
              </select>
              {errors.education && <p className="text-sm text-destructive mt-2">{errors.education.message}</p>}
            </label>

            <label className="block">
              <span className="block text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">Category</span>
              <select
                {...form.register("category")}
                className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              {errors.category && <p className="text-sm text-destructive mt-2">{errors.category.message}</p>}
            </label>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-muted-foreground">All fields are required. AshaAI validates your profile before checking scheme eligibility.</p>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Analyzing profile…" : "Check eligibility"}
            </Button>
          </div>

          {submitError ? <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">{submitError}</div> : null}
        </form>

        {isLoading && (
          <div className="rounded-3xl bg-card ring-1 ring-black/5 p-6 animate-pulse">
            <div className="h-6 w-2/5 rounded-full bg-muted mb-5" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="space-y-3 rounded-3xl border border-border p-5 bg-background">
                  <div className="h-4 w-1/2 rounded-full bg-muted" />
                  <div className="h-3 w-3/4 rounded-full bg-muted" />
                  <div className="h-10 rounded-2xl bg-muted" />
                </div>
              ))}
            </div>
          </div>
        )}

        {analysis && (
          <section className="space-y-6">
            <div className="rounded-3xl bg-card ring-1 ring-black/5 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-primary">AI eligibility score</p>
                  <h2 className="mt-2 text-3xl font-semibold">{analysis.matchScore}% match</h2>
                  <p className="text-sm text-muted-foreground mt-2">{analysis.explanation}</p>
                </div>
                <div className="rounded-3xl bg-primary/10 border border-primary/20 px-5 py-4 text-center">
                  <p className="text-4xl font-extrabold text-primary">{analysis.matchScore}%</p>
                  <p className="text-xs uppercase tracking-widest text-primary/80">Profile alignment</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {analysis.schemes.map((scheme) => (
                <div key={scheme.name} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{scheme.name}</p>
                      <h3 className="mt-2 text-xl font-semibold">{scheme.benefitAmount}</h3>
                    </div>
                    <div className="rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">{scheme.matchScore}%</div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-6">{scheme.whyEligible}</p>
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-semibold text-background"
                  >
                    Apply now
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
