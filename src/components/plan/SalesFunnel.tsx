import { FunnelStep, FunnelTier } from '@/lib/plan-types';

interface Props {
  steps: FunnelStep[];
  tiers: FunnelTier[];
  note: string;
}

const tierStyles = {
  group: 'bg-[hsl(72,18%,92%)] border-[hsl(67,16%,65%)]',
  one: 'bg-[hsl(220,14%,93%)] border-[hsl(210,6%,63%)]',
  mgmt: 'bg-[hsl(30,10%,93%)] border-[hsl(30,6%,73%)]',
};

export function SalesFunnel({ steps, tiers, note }: Props) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5 sm:p-7 mb-9">
      <h3 className="text-[0.78rem] uppercase tracking-wider text-muted-foreground mb-3.5">Your Sales Funnel — Updated Tiered Model</h3>

      {/* Entry flow */}
      <div className="flex flex-wrap items-center gap-0 mb-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center">
            <div className="bg-background border border-border rounded-lg p-2.5 sm:p-3 text-center min-w-[100px]">
              <div className="text-sm font-bold text-primary">{step.price}</div>
              <div className="text-[0.78rem] text-foreground mt-0.5">{step.name}</div>
              <div className="text-[0.68rem] text-muted-foreground">{step.type}</div>
            </div>
            {i < steps.length - 1 && <span className="text-muted-foreground text-xl px-1.5">→</span>}
          </div>
        ))}
        <span className="text-muted-foreground text-xl px-1.5">→</span>
        <div className="text-center px-2">
          <div className="text-[0.75rem] text-muted-foreground">client chooses their path</div>
          <div className="text-[0.72rem] text-muted-foreground">↓ ↓ ↓</div>
        </div>
      </div>

      {/* Tiers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
        {tiers.map((tier, i) => (
          <div key={i} className={`rounded-xl p-3.5 border-2 ${tierStyles[tier.style]}`}>
            <span className="inline-block text-[0.68rem] font-bold uppercase tracking-wide bg-card rounded-full px-2 py-0.5 text-muted-foreground mb-1.5">{tier.badge}</span>
            <div className="text-lg font-bold text-foreground mb-0.5">{tier.price}</div>
            <div className="text-[0.82rem] text-foreground font-medium mb-1.5">{tier.name}</div>
            <div className="text-[0.78rem] text-muted-foreground leading-snug mb-2">{tier.desc}</div>
            <div className="text-[0.72rem] text-primary italic">{tier.tag}</div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[0.82rem] text-muted-foreground italic leading-relaxed">{note}</p>
    </div>
  );
}
