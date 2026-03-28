import { DailyPart, DailyAddon } from '@/lib/plan-types';
import { ProgressBar } from './ProgressBar';

interface Props {
  parts: DailyPart[];
  addons: DailyAddon[];
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  getProgress: (ids: string[]) => { done: number; total: number; pct: number };
}

export function DailyChecklist({ parts, addons, checkedItems, onToggle, getProgress }: Props) {
  const dailyIds = parts.flatMap(p => p.items.map(i => i.id));
  const addonIds = addons.map(a => a.id);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-5">
      <h3 className="text-base text-foreground mb-1 font-body">☀️ Daily Actions Checklist</h3>
      <p className="text-[0.83rem] text-muted-foreground italic mb-5">Your <strong>My Personal Network</strong> accountability framework — all 6 parts, every day.</p>

      <ProgressBar {...getProgress(dailyIds)} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        {parts.map(part => (
          <div key={part.id} className={`bg-background rounded-lg p-3 ${part.wide ? 'sm:col-span-2' : ''}`}>
            <div className="text-[0.72rem] uppercase tracking-wider text-primary font-bold mb-2">{part.label}</div>
            <div className="flex flex-col gap-1.5">
              {part.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => onToggle(item.id)}
                  className={`flex gap-2 items-start text-[0.85rem] text-foreground leading-snug cursor-pointer rounded transition-opacity hover:bg-primary/[0.07] p-1 ${checkedItems[item.id] ? 'item-checked' : ''}`}
                >
                  <span className="text-primary/40 text-base flex-shrink-0">
                    {checkedItems[item.id] ? '✓' : '□'}
                  </span>
                  <span className="item-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-[0.72rem] uppercase tracking-wider text-muted-foreground mb-2.5">+ Daily add-ons specific to your goals</div>
        <ProgressBar {...getProgress(addonIds)} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addons.map(addon => (
            <div
              key={addon.id}
              onClick={() => onToggle(addon.id)}
              className={`flex gap-3 items-start bg-background rounded-lg p-3 cursor-pointer transition-opacity hover:brightness-[0.97] ${checkedItems[addon.id] ? 'item-checked' : ''}`}
            >
              <div className="text-xl flex-shrink-0">{addon.icon}</div>
              <div className="flex flex-col gap-0.5">
                <strong className="text-[0.87rem] text-foreground item-text">{addon.title}</strong>
                <span className="text-[0.8rem] text-muted-foreground leading-snug">{addon.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
