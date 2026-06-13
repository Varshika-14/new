import { useState } from "react";
import { Mic } from "lucide-react";

export function VoiceFab() {
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open voice assistant"
        className="fixed bottom-8 right-8 size-16 bg-accent text-accent-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <span className="size-8 bg-white/20 rounded-full animate-ping absolute" />
        <Mic className="size-6 relative z-10" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-background w-full max-w-md rounded-3xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">AshaAI Voice</p>
                <h3 className="text-xl font-bold">How can I help?</h3>
              </div>
              <select className="text-xs font-mono bg-muted px-3 py-2 rounded-lg border-0">
                <option>English</option>
                <option>हिन्दी</option>
                <option>తెలుగు</option>
              </select>
            </div>

            <button
              onClick={() => setListening((l) => !l)}
              className={`w-full aspect-square max-h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 transition-all ${
                listening ? "border-accent bg-accent/5" : "border-border bg-muted"
              }`}
            >
              <Mic className={`size-10 ${listening ? "text-accent" : "text-muted-foreground"}`} />
              <span className="text-sm font-medium">
                {listening ? "Listening… speak now" : "Tap to start speaking"}
              </span>
            </button>

            <p className="mt-6 text-xs text-muted-foreground text-center">
              Try: <span className="italic">"I'm a B.Tech student from Andhra Pradesh with family income 2.5 lakh."</span>
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full py-3 rounded-xl bg-foreground text-background text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}