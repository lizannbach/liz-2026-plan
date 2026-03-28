import { NetworkContact } from '@/lib/plan-types';

interface Props {
  contacts: NetworkContact[];
}

export function NetworkBox({ contacts }: Props) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5 sm:p-7 mb-9">
      <div className="text-[0.78rem] uppercase tracking-wider text-muted-foreground mb-4">🤝 Your Pipeline Networks — Use These Deliberately</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {contacts.map((c, i) => (
          <div key={i} className="bg-background rounded-lg p-3.5">
            <div className="text-[0.93rem] font-bold text-foreground mb-0.5">{c.name}</div>
            <div className="text-[0.72rem] uppercase tracking-wide text-primary mb-2">{c.sub}</div>
            <div className="text-[0.82rem] text-muted-foreground leading-relaxed">{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
