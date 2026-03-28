import { RealityCard as RealityCardType } from '@/lib/plan-types';

interface Props {
  cards: RealityCardType[];
}

export function RealityCheck({ cards }: Props) {
  return (
    <div>
      <p className="text-[0.75rem] uppercase tracking-[1.2px] text-muted-foreground mb-3.5">Where You Actually Are Right Now</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-9">
        {cards.map(card => (
          <div key={card.id} className="bg-card border border-border rounded-xl p-4">
            <div className="text-[0.72rem] uppercase tracking-wider text-muted-foreground mb-1.5">{card.label}</div>
            <div className="text-xl font-bold text-destructive">{card.current}</div>
            <div className="text-base text-primary italic">{card.goal}</div>
            <div className="text-[0.8rem] text-muted-foreground mt-1">{card.gap}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
