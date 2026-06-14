import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { opportunities } from "@/lib/mock-data";
import { ExternalLink, ShieldCheck, Calendar, BadgeIndianRupee, FileText, ListOrdered, CircleHelp, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/opportunities/$id")({
  loader: ({ params }) => {
    const op = opportunities.find((o) => o.id === params.id);
    if (!op) throw notFound();
    return { op };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.op.name} — AshaAI` },
          { name: "description", content: loaderData.op.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <AppShell>
      <div className="p-10 max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-2">Opportunity not found</h1>
        <Link to="/opportunities" className="text-primary font-semibold">Back to Explorer</Link>
      </div>
    </AppShell>
  ),
  component: Detail,
});

function Detail() {
  const { op } = Route.useLoaderData();
  return (
    <AppShell>
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        <Link to="/opportunities" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to Explorer
        </Link>

        <header className="rounded-3xl bg-card ring-1 ring-black/5 p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-56 bg-primary/5 rounded-full blur-3xl" />
          <div className="flex flex-wrap items-start justify-between gap-6 relative">
            <div className="max-w-xl">
              <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold">{op.category}</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">{op.name}</h1>
              <p className="text-muted-foreground mt-2">{op.ministry}</p>
              <p className="mt-4 text-foreground/80 leading-relaxed">{op.description}</p>
            </div>
            <div className="text-right">
              <div className="size-20 rounded-full border-4 border-accent/20 border-t-accent flex items-center justify-center text-xl font-extrabold text-accent">
                {op.match}%
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mt-2">Match</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-8 relative">
            <KV icon={<BadgeIndianRupee className="size-4" />} k="Benefit" v={op.benefit} />
            <KV icon={<Calendar className="size-4" />} k="Deadline" v={op.deadline} />
            <KV icon={<ShieldCheck className="size-4 text-success" />} k="Verified" v="gov.in domain" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={op.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
            >
              Apply on official portal <ExternalLink className="size-4" />
            </a>
            <Link to="/trusted-browser" search={{ q: op.officialUrl }} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border font-bold hover:bg-muted">
              <ShieldCheck className="size-4" /> Verify link
            </Link>
          </div>
        </header>

        <Section title="Benefits" icon={<BadgeIndianRupee className="size-4" />}>
          <p className="text-foreground/80">{op.benefitDetail}</p>
        </Section>

        <Section title="Eligibility" icon={<ShieldCheck className="size-4" />}>
          <ul className="space-y-2">
            {op.eligibility.map((e: string) => (
              <li key={e} className="flex gap-3"><span className="text-success">✓</span><span>{e}</span></li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-muted-foreground italic">Reason for match: {op.reason}</p>
        </Section>

        <Section title="Required Documents" icon={<FileText className="size-4" />}>
          <div className="grid sm:grid-cols-2 gap-2">
            {op.documents.map((d: string) => (
              <div key={d} className="px-4 py-3 bg-muted rounded-lg text-sm">{d}</div>
            ))}
          </div>
        </Section>

        <Section title="Application Process" icon={<ListOrdered className="size-4" />}>
          <ol className="space-y-3">
            {op.process.map((p: string, i: number) => (
              <li key={p} className="flex gap-4">
                <span className="size-7 shrink-0 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Frequently Asked Questions" icon={<CircleHelp className="size-4" />}>
          <div className="space-y-3">
            {op.faqs.map((f: { q: string; a: string }) => (
              <details key={f.q} className="group p-4 bg-muted rounded-lg">
                <summary className="cursor-pointer font-semibold list-none flex justify-between">
                  {f.q}<span className="text-muted-foreground group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function KV({ icon, k, v }: { icon: React.ReactNode; k: string; v: string }) {
  return (
    <div className="p-4 bg-muted rounded-xl">
      <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{icon}{k}</div>
      <p className="font-bold mt-1">{v}</p>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card ring-1 ring-black/5 p-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">{icon}</span>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      {children}
    </section>
  );
}