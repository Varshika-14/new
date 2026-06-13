import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { VoiceFab } from "@/components/voice-fab";
import { stats } from "@/lib/mock-data";
import {
  Sparkles,
  ShieldCheck,
  Mic,
  LayoutDashboard,
  FileCheck2,
  Compass,
  GraduationCap,
  Tractor,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AshaAI — Discover Government Opportunities in Minutes" },
      {
        name: "description",
        content:
          "AshaAI is an AI-powered navigator for Indian scholarships, schemes, grants and verified official portals.",
      },
      { property: "og:title", content: "AshaAI — Discover Government Opportunities in Minutes" },
      {
        property: "og:description",
        content: "Find personalized scholarships, schemes and grants — safely and verified.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10">
      <SiteHeader />

      {/* Hero */}
      <section className="relative pt-20 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="animate-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10 mb-6">
              <span className="flex size-2 bg-primary rounded-full animate-pulse" />
              <span className="text-xs font-mono font-medium text-primary uppercase tracking-wider">
                v2.0 Government Navigator
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-[1.05] mb-8">
              Discover <span className="text-primary">Government</span> Opportunities in Minutes
            </h1>
            <p className="text-xl text-muted-foreground max-w-[42ch] mb-10 leading-relaxed">
              Find scholarships, schemes, grants, internships and public benefits personalized for
              you — verified against official Government of India sources.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/auth"
                search={{ mode: "signup" }}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:-translate-y-0.5 transition-all shadow-xl shadow-primary/20"
              >
                Get Started
              </Link>
              <Link
                to="/opportunities"
                className="px-8 py-4 bg-background border border-border font-bold rounded-xl hover:bg-muted transition-all inline-flex items-center gap-2"
              >
                Explore Opportunities <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative animate-reveal [animation-delay:200ms]">
            <div className="bg-card ring-1 ring-black/5 shadow-2xl rounded-3xl p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-1">
                    Profile Analysis
                  </p>
                  <h3 className="text-2xl font-bold">Eligibility Match</h3>
                </div>
                <div className="size-16 rounded-full border-4 border-accent/20 border-t-accent flex items-center justify-center">
                  <span className="text-lg font-bold text-accent">82%</span>
                </div>
              </div>
              <div className="space-y-4">
                <MatchRow icon={<GraduationCap className="size-5 text-primary" />} title="PM Research Fellowship" sub="Education Grant" tag="High Match" />
                <MatchRow icon={<Tractor className="size-5 text-primary" />} title="Startup India Seed Fund" sub="Grant Support" tag="Eligible" />
              </div>
            </div>
            <div className="absolute -z-10 -top-6 -right-6 size-64 bg-accent/10 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-y border-border bg-muted">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <Stat n={stats.schemes} l="Schemes Indexed" />
          <Stat n={stats.fund} l="Scholarship Fund" />
          <Stat n={stats.verified} l="Verified Links" />
          <Stat n={stats.assisted} l="Citizens Assisted" />
        </div>
      </div>

      {/* Trusted Browser */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Verified Source Protection</h2>
            <p className="text-muted-foreground max-w-[60ch] mx-auto">
              Our Trusted Government Browser filters out scams and fake portals using real-time
              domain verification against the NIC / gov.in registry.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TrustCard
              level="success"
              label="Verified Official"
              url="https://pms.nic.in/portal/apply"
              heading="Trusted Resource"
              body="Legitimate .nic.in domain operated by the Ministry."
            />
            <TrustCard
              level="warning"
              label="Unofficial Source"
              url="https://scholarship-news-india.com"
              heading="Exercise Caution"
              body="Informational blog only. Not for application submission."
            />
            <TrustCard
              level="error"
              label="Potentially Unsafe"
              url="http://pm-schemes-free-reg.tk"
              heading="Access Blocked"
              body="Suspected phishing attempt. Domain is not authorized."
              pulse
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-16 text-center">Intelligent Assistant Services</h2>
          <div className="grid md:grid-cols-3 gap-x-12 gap-y-12">
            <Feature icon={<Sparkles className="size-5 text-primary-foreground" />} bg="bg-primary" title="AI Eligibility Checker" body="Instant profile matching against thousands of schemes using advanced NLP." />
            <Feature icon={<ShieldCheck className="size-5 text-accent-foreground" />} bg="bg-accent" title="Trusted Government Browser" body="Verify any URL against the NIC registry before submitting documents." />
            <Feature icon={<Mic className="size-5 text-primary-foreground" />} bg="bg-foreground" title="Voice Assistant" body="Navigate bureaucracy via Hindi, Telugu or English voice commands." />
            <Feature icon={<LayoutDashboard className="size-5 text-primary-foreground" />} bg="bg-primary" title="Opportunity Dashboard" body="Deadlines, application status and personalised alerts in one view." />
            <Feature icon={<FileCheck2 className="size-5 text-accent-foreground" />} bg="bg-accent" title="Application Guidance" body="Step-by-step document checklists tailored to your application." />
            <Feature icon={<Compass className="size-5 text-primary-foreground" />} bg="bg-foreground" title="Personalized Recommendations" body="Continuously updated suggestions as new schemes launch." />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold tracking-tight mb-16 text-center">Your Journey to Success</h2>
          <div className="grid md:grid-cols-4 gap-12">
            <Step n="01" t="Enter Profile" b="Share educational and demographic details securely." />
            <Step n="02" t="Check Eligibility" b="AI analyses thousands of schemes against your data." />
            <Step n="03" t="Explore Matches" b="Browse personalised recommendations ranked by benefit." />
            <Step n="04" t="Apply Safely" b="Use verified official links to submit your application." />
          </div>
        </div>
      </section>

      <SiteFooter />
      <VoiceFab />
    </div>
  );
}

function MatchRow({ icon, title, sub, tag }: { icon: React.ReactNode; title: string; sub: string; tag: string }) {
  return (
    <div className="p-4 bg-muted rounded-xl border border-border flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="size-10 bg-background rounded-lg flex items-center justify-center shadow-sm">{icon}</div>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
      </div>
      <span className="px-2 py-1 bg-success/10 text-success text-[10px] font-bold rounded uppercase">{tag}</span>
    </div>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-extrabold mb-1">{n}</p>
      <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{l}</p>
    </div>
  );
}

function TrustCard({
  level,
  label,
  url,
  heading,
  body,
  pulse,
}: {
  level: "success" | "warning" | "error";
  label: string;
  url: string;
  heading: string;
  body: string;
  pulse?: boolean;
}) {
  const dot = level === "success" ? "bg-success" : level === "warning" ? "bg-warning" : "bg-destructive";
  const txt = level === "success" ? "text-success" : level === "warning" ? "text-warning" : "text-destructive";
  const ring = level === "success" ? "hover:ring-success/50" : level === "warning" ? "hover:ring-warning/50" : "hover:ring-destructive/50";
  const bg = level === "success" ? "bg-success/5 border-success/10" : level === "warning" ? "bg-warning/5 border-warning/10" : "bg-destructive/5 border-destructive/10";
  return (
    <div className={`bg-card p-6 rounded-2xl ring-1 ring-black/5 transition-all ${ring}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`size-3 ${dot} rounded-full ${pulse ? "animate-pulse" : ""}`} />
        <span className={`text-xs font-mono ${txt} font-bold uppercase tracking-wider`}>{label}</span>
      </div>
      <div className="mb-6 p-4 bg-muted rounded-lg text-xs font-mono text-muted-foreground truncate">{url}</div>
      <div className={`p-4 ${bg} border rounded-xl`}>
        <p className={`text-sm font-bold ${txt} mb-1`}>{heading}</p>
        <p className={`text-xs ${txt}/80`}>{body}</p>
      </div>
    </div>
  );
}

function Feature({ icon, bg, title, body }: { icon: React.ReactNode; bg: string; title: string; body: string }) {
  return (
    <div>
      <div className={`size-12 ${bg} rounded-xl flex items-center justify-center mb-6`}>{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}

function Step({ n, t, b }: { n: string; t: string; b: string }) {
  return (
    <div>
      <div className="text-5xl font-extrabold text-primary/15 mb-4">{n}</div>
      <h4 className="font-bold mb-2">{t}</h4>
      <p className="text-sm text-muted-foreground leading-relaxed">{b}</p>
    </div>
  );
}
