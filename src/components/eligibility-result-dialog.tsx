import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ExternalLink, TrendingUp } from "lucide-react";

interface EligibilityResultDialogProps {
  open: boolean;
  onClose: () => void;
  results: any[];
}

export function EligibilityResultDialog({ open, onClose, results }: EligibilityResultDialogProps) {
  const eligibleCount = results.filter((r) => r.isEligible).length;
  const topMatch = results[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="size-6 text-primary" />
            Eligibility Analysis Complete
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          {/* Overall Score */}
          <div className="rounded-3xl bg-primary/10 border border-primary/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-primary mb-1">Overall Match Score</p>
                <p className="text-4xl font-extrabold text-primary">{topMatch?.calculatedScore || 0}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Eligible Schemes</p>
                <p className="text-2xl font-bold text-primary">{eligibleCount}</p>
              </div>
            </div>
          </div>

          {/* Top Recommendation */}
          {topMatch && topMatch.isEligible && (
            <div className="rounded-3xl bg-card ring-1 ring-black/5 p-6">
              <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">Top Recommendation</p>
              <h3 className="text-2xl font-bold mb-2">{topMatch.name}</h3>
              <p className="text-green-600 font-semibold text-lg mb-2">{topMatch.benefit}</p>
              <p className="text-sm text-muted-foreground">{topMatch.benefitDetail}</p>
              
              <div className="mt-4 p-4 bg-green-50 rounded-xl">
                <p className="text-xs font-mono uppercase tracking-widest text-green-700 mb-2">Why Eligible</p>
                <ul className="space-y-1">
                  {topMatch.reasons.slice(0, 4).map((reason: string, idx: number) => (
                    <li key={idx} className="text-sm text-green-700 flex items-center gap-2">
                      <CheckCircle className="size-4" /> {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                asChild
                className="mt-4 w-full"
              >
                <a
                  href={topMatch.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="size-4" />
                  Apply Now
                </a>
              </Button>
            </div>
          )}

          {/* All Results Summary */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">All Results</p>
            <div className="space-y-3">
              {results.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full px-3 py-1 text-sm font-semibold ${item.calculatedScore >= 80 ? 'bg-green-100 text-green-700' : item.calculatedScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {item.calculatedScore}%
                    </div>
                    {item.isEligible ? (
                      <CheckCircle className="size-5 text-green-600" />
                    ) : (
                      <XCircle className="size-5 text-red-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents for Top Match */}
          {topMatch && topMatch.documents && (
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Required Documents</p>
              <div className="flex flex-wrap gap-2">
                {topMatch.documents.map((doc: string, idx: number) => (
                  <span key={idx} className="px-3 py-2 bg-muted rounded-full text-sm font-medium">
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
