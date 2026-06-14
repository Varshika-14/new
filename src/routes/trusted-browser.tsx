import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrustedBrowserResult } from "@/shared/types";
import { browserFetch } from "@/lib/browser-fetch";
import { Search, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/trusted-browser")({
  head: () => ({ meta: [{ title: "Trusted Government Browser — AshaAI" }] }),
  component: TrustedBrowserPage,
});

const samples = [
  "OpenAI",
  "GitHub",
  "Microsoft",
  "PM Internship",
  "NSP Scholarship",
  "JNTUH",
  "Flipkart",
  "Amazon",
];

function TrustedBrowserPage() {
  const [searchText, setSearchText] = useState("");
  const [verification, setVerification] = useState<TrustedBrowserResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkBadge = (score: number) => {
    if (score >= 90) return { label: "🟢 Verified Official", color: "bg-emerald-100 text-emerald-800" };
    if (score >= 70) return { label: "🟡 Likely Official", color: "bg-amber-100 text-amber-800" };
    return { label: "🔴 Not Verified", color: "bg-rose-100 text-rose-800" };
  };

  async function runVerification(searchValue: string) {
    const trimmed = searchValue.trim();
    if (!trimmed) {
      setError("Enter a website, company, or scheme name to verify.");
      return;
    }

    setError(null);
    setVerification(null);
    setIsLoading(true);

    try {
      const response = await browserFetch("/api/trusted-browser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ searchQuery: trimmed }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Unable to verify the website right now.");
      }
      setVerification(result as TrustedBrowserResult);
    } catch (err) {
      console.error(err);
      setError((err as Error).message || "Unable to verify the website right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    await runVerification(searchText);
  }

  async function handleSampleClick(sample: string) {
    setSearchText(sample);
    await runVerification(sample);
  }

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <header>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Trusted Browser</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Verify any portal before you click</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Search a company, government scheme, scholarship, university, or organization. AshaAI finds the official website and flags suspicious sources.
          </p>
        </header>

        <form onSubmit={handleSearch} className="rounded-3xl bg-card ring-1 ring-black/5 p-4 md:p-6 flex flex-col gap-3 md:flex-row">
          <div className="flex-1 flex items-center gap-3 rounded-2xl bg-muted px-4 py-3">
            <Search className="size-4 text-muted-foreground" />
            <Input
              placeholder="Search for OpenAI, GitHub, NSP Scholarship, PM Internship, Flipkart, JNTUH"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
            {isLoading ? "Verifying…" : "Verify"}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-muted-foreground font-mono uppercase tracking-wider">Try:</span>
          {samples.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => void handleSampleClick(sample)}
              className="rounded-full bg-muted px-4 py-2 text-muted-foreground transition hover:bg-muted/80"
            >
              {sample}
            </button>
          ))}
        </div>

        {error ? (
          <div className="rounded-3xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">{error}</div>
        ) : null}

        {isLoading ? (
          <div className="rounded-3xl bg-card ring-1 ring-black/5 p-6 space-y-4">
            <div className="h-5 w-1/2 rounded-full bg-muted animate-pulse" />
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, index) => (
                <div key={index} className="space-y-3 rounded-3xl border border-border p-5 bg-background animate-pulse">
                  <div className="h-4 w-3/4 rounded-full bg-muted" />
                  <div className="h-3 w-full rounded-full bg-muted" />
                  <div className="h-10 rounded-2xl bg-muted" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {!isLoading && verification ? (
          <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">{verification.organization}</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{verification.organization}</h2>
              </div>
              <div className="flex flex-col items-start gap-2 md:items-end">
                <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${checkBadge(verification.confidence).color}`}>
                  {checkBadge(verification.confidence).label}
                </span>
                <p className="text-4xl font-extrabold">{verification.confidence}%</p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Trust score</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Official Website</p>
                {verification.officialWebsite ? (
                  <a
                    href={verification.officialWebsite}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-2 block text-lg font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {verification.officialWebsite}
                  </a>
                ) : (
                  <p className="mt-2 text-lg font-semibold text-muted-foreground">No official website found</p>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">AI reasoning</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{verification.reason}</p>
              </div>
            </div>

            {verification.confidence < 70 ? (
              <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                ⚠️ This source may not be fully verified. Proceed carefully.
              </div>
            ) : null}

            {verification.officialWebsite ? (
              <a
                href={verification.officialWebsite}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:bg-foreground/90"
              >
                Visit Official Site <ArrowUpRight className="size-4" />
              </a>
            ) : null}
          </div>
        ) : null}

        {!isLoading && !verification && !error ? (
          <div className="rounded-3xl border border-border bg-card p-6 text-center text-muted-foreground">
            Enter a query and AshaAI will verify the official website.
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
