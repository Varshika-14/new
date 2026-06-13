import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="size-4 border-2 border-primary-foreground rounded-sm" />
          </div>
          <span className="font-extrabold text-xl tracking-tighter">AshaAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link to="/opportunities" className="hover:text-foreground transition-colors">Opportunities</Link>
          <Link to="/eligibility" className="hover:text-foreground transition-colors">Eligibility</Link>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/auth" className="text-sm font-semibold">Log In</Link>
          <Link
            to="/auth"
            search={{ mode: "signup" }}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:shadow-lg hover:shadow-primary/20 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}