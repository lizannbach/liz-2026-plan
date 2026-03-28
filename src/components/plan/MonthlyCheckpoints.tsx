import { MonthlyColumn } from '@/lib/plan-types';
import { ProgressBar } from './ProgressBar';

interface Props {
  columns: MonthlyColumn[];
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  getProgress: (ids: string[]) => { done: number; total: number; pct: number };
}

export function MonthlyCheckpoints({ columns, checkedItems, onToggle, getProgress }: Props) {
  const allIds = columns.flatMap(c => c.items.map(i => i.id));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-5">
      <h3 className="text-base text-foreground mb-1 font-body">📊 Monthly Checkpoints</h3>
      <p className="text-[0.83rem] text-muted-foreground italic mb-5">At the end of each month, sit down with this list. Honest answers only.</p>

      <ProgressBar {...getProgress(allIds)} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {columns.map(col => (
          <div key={col.id} className="border border-border rounded-xl overflow-hidden">
            <div className="bg-accent px-3.5 py-2.5 text-[0.8rem] font-bold text-foreground/60 text-center border-b border-border">
              {col.header}
            </div>
            <ul className="list-none p-3">
              {col.items.map(item => (
                <li
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={`text-[0.81rem] text-foreground/80 leading-relaxed py-1.5 border-b border-border/40 flex gap-1.5 items-start cursor-pointer rounded hover:bg-primary/5 transition-opacity last:border-b-0 ${checkedItems[item.id] ? 'item-checked' : ''}`}
                >
                  <span className="text-muted-foreground/50 flex-shrink-0 text-sm">
                    {checkedItems[item.id] ? '✓' : '□'}
                  </span>
                  <span className="item-text">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
