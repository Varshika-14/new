import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { notifications, categories } from "@/lib/mock-data";
import { Bell, ArrowRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — AshaAI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [userName, setUserName] = useState("Citizen");
  const [dashboardOpportunities, setDashboardOpportunities] = useState(() => []);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { displayName?: string; email?: string };
        setUserName(parsed.displayName || parsed.email || "Citizen");
      } catch {
        setUserName("Citizen");
      }
    }

    const token = localStorage.getItem("idToken");
    if (!token) return;

    window.fetch("/api/session", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.authenticated && result.user) {
          setUserName(result.user.name || result.user.email || "Citizen");
        }
      })
      .catch(() => {
        /* ignore session fetch failure */
      });
  }, []);

  const top = dashboardOpportunities.length
    ? dashboardOpportunities.slice(0, 3)
    : [];

  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Good evening</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Welcome back, {userName}</h1>
          </div>
          <Link
            to="/eligibility"
            className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:shadow-lg hover:shadow-primary/20 transition"
          >
            Re-run Eligibility
          </Link>
        </header>

        {/* Score + notifs */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl bg-card ring-1 ring-black/5 p-8 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 size-64 bg-primary/5 rounded-full blur-3xl" />
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Opportunity score</p>
            <div className="flex items-end gap-4 mt-2">
              <span className="text-7xl font-extrabold tracking-tight text-primary">82%</span>
              <div className="flex items-center gap-1 text-success text-sm font-semibold pb-3">
                <TrendingUp className="size-4" /> +6 this week
              </div>
            </div>
            <p className="mt-2 text-muted-foreground">High match across 14 active opportunities.</p>
            <div className="mt-6 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full w-[82%] bg-primary" />
            </div>
          </div>

          <div className="rounded-3xl bg-card ring-1 ring-black/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="size-4 text-primary" />
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Notifications</p>
            </div>
            <ul className="space-y-3">
              {notifications.slice(0, 3).map((n) => (
                <li key={n.id} className="text-sm">
                  <p className="font-medium leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                </li>
              ))}
            </ul>
            <Link to="/notifications" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Recommended */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold">Recommended Opportunities</h2>
            <Link to="/opportunities" className="text-sm font-semibold text-primary inline-flex items-center gap-1">
              See all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {top.map((o) => (
              <Link
                key={o.id}
                to="/opportunities/$id"
                params={{ id: o.id }}
                className="block rounded-2xl bg-card ring-1 ring-black/5 p-6 hover:ring-primary/30 hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">{o.category}</span>
                  <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded uppercase">{o.match}% match</span>
                </div>
                <h3 className="font-bold leading-snug mb-2">{o.name}</h3>
                <p className="text-xs text-muted-foreground">{o.ministry}</p>
                <div className="mt-4 pt-4 border-t border-border text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Benefit</span>
                    <span className="font-semibold">{o.benefit}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Deadline</span>
                    <span className="font-semibold">{o.deadline}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold mb-4">Opportunity Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Link
                key={c}
                to="/opportunities"
                search={{ category: c }}
                className="px-4 py-2 rounded-full bg-card ring-1 ring-border text-sm font-medium hover:ring-primary/40 hover:text-primary transition"
              >
                {c}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}