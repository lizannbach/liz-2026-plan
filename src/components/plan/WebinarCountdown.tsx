import { WebinarWeek } from '@/lib/plan-types';
import { ProgressBar } from './ProgressBar';

interface Props {
  weeks: WebinarWeek[];
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  getProgress: (ids: string[]) => { done: number; total: number; pct: number };
}

export function WebinarCountdown({ weeks, checkedItems, onToggle, getProgress }: Props) {
  const ids = weeks.map(w => w.id);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-5">
      <h3 className="text-base text-foreground mb-1 font-body">🎯 April 22 Webinar — Week-by-Week Countdown</h3>
      <p className="text-[0.83rem] text-muted-foreground italic mb-5">This is your single biggest lead gen event of Phase 1. Treat every week like a campaign.</p>

      <ProgressBar {...getProgress(ids)} />
      <div className="border border-border rounded-xl overflow-hidden">
        {weeks.map(week => (
          <div
            key={week.id}
            onClick={() => onToggle(week.id)}
            className={`flex border-b border-border/40 last:border-b-0 cursor-pointer transition-opacity hover:bg-primary/[0.04] ${
              checkedItems[week.id] ? 'opacity-40' : ''
            } ${week.isEvent ? 'bg-[hsl(40,18%,94%)]' : ''}`}
          >
            <div className={`bg-background px-3.5 py-2.5 text-[0.78rem] font-bold text-muted-foreground min-w-[120px] sm:min-w-[130px] flex-shrink-0 flex items-center border-r border-border/40 ${
              week.isEvent ? '!bg-[hsl(40,18%,94%)] !text-foreground' : ''
            }`}>
              {week.label}
            </div>
            <div className={`px-4 py-2.5 text-[0.85rem] text-foreground/80 leading-relaxed ${checkedItems[week.id] ? 'item-checked' : ''}`}>
              <span className="item-text">{week.content}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
