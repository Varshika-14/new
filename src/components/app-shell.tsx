import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Sparkles,
  Compass,
  ShieldCheck,
  Bell,
  Settings2,
  Activity,
  Moon,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import { VoiceFab } from "./voice-fab";
import { useState, useEffect } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/eligibility", label: "Eligibility Checker", icon: Sparkles },
  { to: "/opportunities", label: "Opportunities", icon: Compass },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/admin", label: "Admin Panel", icon: Settings2 },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const saved = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = saved === "true" || (!saved && prefersDark);
    setDarkMode(initialDark);
    if (initialDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", (!darkMode).toString());
  };

  return (
    <div className="min-h-screen bg-muted/40 flex">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-background sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-6 h-16 border-b border-border">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="size-4 border-2 border-primary-foreground rounded-sm" />
          </div>
          <span className="font-extrabold text-lg tracking-tighter">AshaAI</span>
        </Link>
        <button
          onClick={toggleDarkMode}
          className="mx-6 p-2 rounded-lg hover:bg-muted transition-colors"
          title="Toggle dark mode"
        >
          {darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active =
              item.to === "/opportunities"
                ? pathname.startsWith("/opportunities")
                : pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
            <div className="flex items-center gap-2 text-xs font-mono text-primary uppercase tracking-wider mb-1">
              <Activity className="size-3" /> Live status
            </div>
            <p className="text-xs text-muted-foreground">14 opportunities updated today.</p>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="md:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border h-14 flex items-center px-4 justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 bg-primary rounded-md flex items-center justify-center">
              <div className="size-3 border-2 border-primary-foreground rounded-sm" />
            </div>
            <span className="font-extrabold tracking-tighter">AshaAI</span>
          </Link>
          <Link to="/dashboard" className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            Menu
          </Link>
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <VoiceFab />
    </div>
  );
}