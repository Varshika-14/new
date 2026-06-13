import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/app-shell";
import { categories } from "@/lib/mock-data";
import { opportunitiesDataset } from "@/lib/data/opportunities.dataset";
import { Search, Filter, ExternalLink } from "lucide-react";

const searchSchema = z.object({
  category: z.string().optional(),
  state: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/opportunities")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Opportunity Explorer — AshaAI" }] }),
  component: OppLayout,
});

function OppLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/opportunities") return <Outlet />;
  return <Explorer />;
}

function Explorer() {
  const search = Route.useSearch();
  const [q, setQ] = useState(search.q ?? "");
  const [category, setCategory] = useState<string>(search.category ?? "All");
  const [state, setState] = useState<string>(search.state ?? "All India");

  const handleNotify = async (title: string) => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      alert("Please log in to receive notifications");
      return;
    }
    const user = JSON.parse(userStr);
    
    await window.fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        message: `New opportunity available: ${title}`,
      }),
    });
    
    alert("Notification sent to your email!");
  };

  const results = useMemo(() => {
    const query = q.toLowerCase();
    const filtered = opportunitiesDataset.filter((item) => {
      const matchesQuery = 
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.snippet.toLowerCase().includes(query);
      
      const matchesCategory = category === "All" || item.category === category;
      
      return matchesQuery && matchesCategory;
    });

    return filtered.length ? filtered : opportunitiesDataset;
  }, [q, category]);

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <header>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Explorer</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">All Government Opportunities</h1>
          <p className="text-muted-foreground mt-2">Filter, search and discover {results.length}+ active programs with direct apply links.</p>
        </header>

        <div className="rounded-2xl bg-card ring-1 ring-black/5 p-4 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 rounded-xl bg-muted">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search schemes, scholarships, ministries…"
              className="flex-1 bg-transparent py-3 focus:outline-none text-sm"
            />
          </div>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-3 rounded-xl bg-muted text-sm font-medium">
            <option>All</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((r, i) => (
            <div key={i} className="border p-5 rounded-xl bg-card hover:ring-primary/30 hover:-translate-y-0.5 transition-all">
              <div className="flex justify-between items-start mb-3">
                <h2 className="font-bold text-lg leading-tight">{r.title}</h2>
                <span className="text-xs bg-muted px-2 py-1 rounded whitespace-nowrap ml-2">
                  {r.category}
                </span>
              </div>

              <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                {r.snippet}
              </p>

              <p className="text-green-600 font-semibold mt-3">
                {r.benefit}
              </p>

              <div className="flex gap-2 mt-4">
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm"
                >
                  <ExternalLink className="size-4" /> Apply Now
                </a>
                <button
                  onClick={() => handleNotify(r.title)}
                  className="inline-flex items-center gap-1 text-primary hover:underline font-medium text-sm"
                >
                  🔔 Notify Me
                </button>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="col-span-full text-center py-16 text-muted-foreground">
              No opportunities found. Try adjusting your search or filters.
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}