import { WeeklyArea } from '@/lib/plan-types';
import { ProgressBar } from './ProgressBar';

interface Props {
  areas: WeeklyArea[];
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  getProgress: (ids: string[]) => { done: number; total: number; pct: number };
}

export function WeeklyTasks({ areas, checkedItems, onToggle, getProgress }: Props) {
  const allIds = areas.flatMap(a => a.items.map(i => i.id));

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-5">
      <h3 className="text-base text-foreground mb-1 font-body">📅 Weekly Tasks by Goal Area</h3>
      <p className="text-[0.83rem] text-muted-foreground italic mb-5">These happen on a recurring weekly rhythm. Block time on your calendar.</p>

      <ProgressBar {...getProgress(allIds)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {areas.map(area => (
          <div key={area.id} className="border border-border rounded-xl overflow-hidden">
            <div className={`px-3.5 py-2 text-[0.8rem] font-bold text-primary-foreground ${area.color}`}>
              {area.title}
            </div>
            <ul className="list-none p-3">
              {area.items.map(item => (
                <li
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={`text-[0.83rem] text-foreground/80 leading-relaxed py-1 border-b border-border/40 cursor-pointer rounded hover:bg-primary/5 transition-opacity last:border-b-0 ${checkedItems[item.id] ? 'item-checked' : ''}`}
                >
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
