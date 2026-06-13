import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="py-20 bg-foreground text-white/90">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="size-6 bg-primary rounded flex items-center justify-center">
                <div className="size-3 border border-white rounded-sm" />
              </div>
              <span className="font-bold text-lg tracking-tight">AshaAI</span>
            </div>
            <p className="max-w-sm text-white/60 mb-8">
              Empowering Indian citizens with direct, verified, and AI-assisted access to government benefits.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/opportunities" className="hover:text-accent transition-colors">Opportunities</Link></li>
              <li><Link to="/eligibility" className="hover:text-accent transition-colors">Eligibility</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-mono uppercase tracking-widest text-white/40 mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-white/40 uppercase">
          <p>© 2026 AshaAI — Built for Digital India</p>
          <p>An unofficial public-welfare initiative</p>
        </div>
      </div>
    </footer>
  );
}