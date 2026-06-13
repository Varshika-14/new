import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { opportunities } from "@/lib/mock-data";
import { Users, Activity, ShieldCheck, Search, Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel — AshaAI" }] }),
  component: Admin,
});

function Admin() {
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-1">Admin</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Operations Console</h1>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
            <Plus className="size-4" /> Add opportunity
          </button>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric icon={<Users className="size-4" />} k="Active users" v="12,482" />
          <Metric icon={<Search className="size-4" />} k="Searches today" v="48,210" />
          <Metric icon={<Activity className="size-4" />} k="Popular scheme" v="PMRF" />
          <Metric icon={<ShieldCheck className="size-4" />} k="Verification requests" v="2,156" />
        </div>

        <section className="rounded-3xl bg-card ring-1 ring-black/5 overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-bold">Manage opportunities</h2>
            <div className="flex items-center gap-2 px-3 rounded-lg bg-muted">
              <Search className="size-4 text-muted-foreground" />
              <input placeholder="Search…" className="bg-transparent py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs font-mono uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3">Scheme</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Ministry</th>
                <th className="text-left px-6 py-3 hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3">Deadline</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody>
              {opportunities.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-6 py-4 font-semibold">{o.name}</td>
                  <td className="px-6 py-4 text-muted-foreground hidden md:table-cell">{o.ministry}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2 py-0.5 bg-muted rounded text-[10px] font-mono uppercase tracking-wider">{o.category}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{o.deadline}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground" aria-label="Edit">
                        <Pencil className="size-4" />
                      </button>
                      <button className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center text-muted-foreground" aria-label="Delete">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="rounded-2xl bg-card ring-1 ring-black/5 p-5">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
        {icon}{k}
      </div>
      <p className="text-2xl font-extrabold tracking-tight">{v}</p>
    </div>
  );
}