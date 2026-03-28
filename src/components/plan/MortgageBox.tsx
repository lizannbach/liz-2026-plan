interface MortgageProps {
  title: string;
  cards: { label: string; value: string; note: string }[];
  body: string;
}

export function MortgageBox({ title, cards, body }: MortgageProps) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5 sm:p-7 my-9">
      <h3 className="text-[0.9rem] text-foreground/80 mb-3 font-body font-normal">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3.5">
        {cards.map((c, i) => (
          <div key={i} className="bg-background rounded-lg p-3">
            <div className="text-[0.7rem] uppercase tracking-wide text-muted-foreground mb-1">{c.label}</div>
            <div className="text-base font-bold text-foreground">{c.value}</div>
            <div className="text-[0.77rem] text-muted-foreground mt-0.5">{c.note}</div>
          </div>
        ))}
      </div>
      <p className="text-[0.83rem] text-muted-foreground italic leading-relaxed">{body}</p>
    </div>
  );
}
