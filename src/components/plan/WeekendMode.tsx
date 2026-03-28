import { useState } from 'react';
import { WeekendTask } from '@/lib/plan-types';

interface Props {
  tasks: WeekendTask[];
}

const CATEGORY_ORDER = ['Home Reset', 'Declutter & Sell', 'Finance Check', 'Set Up for the Week'];

const CATEGORY_ICONS: Record<string, string> = {
  'Home Reset': '🏠',
  'Declutter & Sell': '📦',
  'Finance Check': '💰',
  'Set Up for the Week': '🗓',
};

// Returns the ISO date of the Saturday for the current weekend (shared key for Sat + Sun)
function getWeekendKey(): string {
  const now = new Date();
  const day = now.getDay(); // 0=Sun, 6=Sat
  const sat = new Date(now);
  if (day === 0) sat.setDate(now.getDate() - 1); // Sunday → back to Saturday
  return sat.toISOString().slice(0, 10);
}

export function WeekendMode({ tasks }: Props) {
  const today = new Date().getDay();
  const isWeekend = today === 0 || today === 6;
  const dayLabel = today === 6 ? 'Saturday' : 'Sunday';

  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('liz-weekend-checked');
      if (stored) {
        const { date, items } = JSON.parse(stored);
        if (date === getWeekendKey()) return items;
      }
    } catch {}
    return {};
  });

  if (!isWeekend) return null;

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      localStorage.setItem('liz-weekend-checked', JSON.stringify({
        date: getWeekendKey(),
        items: next,
      }));
      return next;
    });
  };

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    items: tasks.filter(t => t.category === cat),
  })).filter(g => g.items.length > 0);

  const total = tasks.length;
  const done = tasks.filter(t => checked[t.id]).length;

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">🌿</span>
          <div>
            <h3 className="text-[0.85rem] uppercase tracking-[1.2px] text-foreground font-medium">
              {dayLabel} Reset
            </h3>
            <p className="text-[0.75rem] text-muted-foreground mt-0.5">
              Wildflower can wait — today is for you and your home.
            </p>
          </div>
        </div>
        <span className="text-[0.75rem] text-muted-foreground">{done}/{total}</span>
      </div>

      <div className="space-y-4">
        {grouped.map(({ category, items }) => (
          <div key={category}>
            <p className="text-[0.7rem] uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
              <span>{CATEGORY_ICONS[category]}</span>
              {category}
            </p>
            <div className="space-y-1.5">
              {items.map(task => (
                <label
                  key={task.id}
                  className="flex items-start gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={!!checked[task.id]}
                    onChange={() => toggle(task.id)}
                    className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer flex-shrink-0"
                  />
                  <span className={`text-[0.85rem] leading-snug ${checked[task.id] ? 'line-through text-muted-foreground/50' : 'text-foreground/80'}`}>
                    {task.text}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
