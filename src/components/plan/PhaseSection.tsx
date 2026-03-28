import { Phase as PhaseType, ActionItem } from '@/lib/plan-types';
import { ProgressBar } from './ProgressBar';
import { DailyChecklist } from './DailyChecklist';
import { WeeklyTasks } from './WeeklyTasks';
import { WebinarCountdown } from './WebinarCountdown';
import { MonthlyCheckpoints } from './MonthlyCheckpoints';

interface Props {
  phase: PhaseType;
  checkedItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  getProgress: (ids: string[]) => { done: number; total: number; pct: number };
}

const phaseColors: Record<string, { border: string; bg: string }> = {
  olive: { border: 'border-primary', bg: 'bg-primary' },
  slate: { border: 'border-slate', bg: 'bg-slate' },
};

function ActionItemRow({ item, checked, onToggle }: { item: ActionItem; checked: boolean; onToggle: () => void }) {
  const prefix = item.type === 'urgent' ? '🔥' : item.type === 'money' ? '$' : '→';
  return (
    <li
      onClick={onToggle}
      className={`text-[0.88rem] text-foreground/80 leading-relaxed py-1.5 border-b border-border/40 flex gap-2 items-start cursor-pointer rounded transition-opacity hover:bg-primary/5 ${checked ? 'item-checked' : ''}`}
    >
      <span className={`flex-shrink-0 ${item.type === 'money' ? 'text-primary font-bold' : 'text-muted-foreground/50'}`}>{prefix}</span>
      <span className="item-text">{item.text}</span>
    </li>
  );
}

export function PhaseSection({ phase, checkedItems, onToggle, getProgress }: Props) {
  const colors = phaseColors[phase.colorClass] || phaseColors.olive;
  const actionIds = phase.actionGroups.flatMap(g => g.items.map(i => i.id));
  const actionProgress = getProgress(actionIds);

  return (
    <div className="mb-11">
      {/* Phase header */}
      <div className={`flex flex-wrap items-center gap-4 mb-2.5 pb-3.5 border-b-2 ${colors.border}`}>
        <div className={`w-[42px] h-[42px] rounded-full flex items-center justify-center text-base font-bold text-primary-foreground flex-shrink-0 ${colors.bg}`}>
          {phase.number}
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">{phase.title}</h2>
          <div className="text-[0.8rem] text-muted-foreground italic mt-0.5">{phase.dates}</div>
        </div>
        <div className="ml-auto text-[0.8rem] text-muted-foreground italic text-right whitespace-nowrap">{phase.focus}</div>
      </div>

      {/* Countdown note for phase 2 */}
      {phase.countdownNote && (
        <div className="bg-[hsl(40,18%,94%)] border border-primary/30 rounded-xl p-3.5 mb-3.5 text-[0.87rem] text-slate flex items-center gap-2.5">
          ⏳ <strong>{phase.countdownNote}</strong>
        </div>
      )}

      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-4">{phase.intro}</p>

      {/* Webinar callout */}
      {phase.webinarCallout && (
        <div className="bg-gradient-to-br from-[hsl(40,20%,90%)] to-[hsl(90,14%,89%)] border-2 border-primary rounded-[14px] p-5 mb-5 flex gap-4 items-start">
          <div className="bg-primary text-primary-foreground rounded-lg px-3.5 py-2 text-[0.8rem] font-bold text-center flex-shrink-0 leading-relaxed min-w-[60px] whitespace-pre-line">{phase.webinarCallout.date}</div>
          <div>
            <h3 className="text-base text-foreground mb-1.5 font-body">{phase.webinarCallout.title}</h3>
            <p className="text-[0.85rem] text-muted-foreground leading-relaxed">{phase.webinarCallout.body}</p>
            <ul className="mt-2 pl-4 text-[0.85rem] text-foreground/70 leading-relaxed list-disc">
              {phase.webinarCallout.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Action groups */}
      <ProgressBar {...actionProgress} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {phase.actionGroups.map(group => (
          <div key={group.id} className="bg-card border border-border rounded-[14px] p-4">
            <h3 className="text-[0.75rem] uppercase tracking-wider text-muted-foreground mb-2.5">{group.icon} {group.title}</h3>
            <ul className="list-none">
              {group.items.map(item => (
                <ActionItemRow key={item.id} item={item} checked={!!checkedItems[item.id]} onToggle={() => onToggle(item.id)} />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Milestone */}
      <div className={`bg-[hsl(30,20%,96%)] border-l-[3px] ${colors.border} rounded-r-lg p-3 mt-4 text-[0.87rem] text-muted-foreground italic leading-relaxed`}>
        {phase.milestone}
      </div>

      {/* Phase 1 granular sections */}
      {phase.dailyParts && (
        <div className="mt-10">
          <div className="text-center mb-8">
            <span className="inline-block bg-primary text-primary-foreground rounded-full px-3.5 py-1 text-[0.75rem] font-bold tracking-wide mb-2.5">Phase {phase.number} Deep Dive</span>
            <h2 className="font-heading text-3xl font-semibold text-foreground mb-1.5">Daily · Weekly · Monthly Tasks</h2>
            <p className="text-[0.9rem] text-muted-foreground italic">{phase.dates} — the exact actions that make the milestones happen</p>
          </div>

          <DailyChecklist
            parts={phase.dailyParts!}
            addons={phase.dailyAddons || []}
            checkedItems={checkedItems}
            onToggle={onToggle}
            getProgress={getProgress}
          />

          {phase.weeklyAreas && (
            <WeeklyTasks
              areas={phase.weeklyAreas}
              checkedItems={checkedItems}
              onToggle={onToggle}
              getProgress={getProgress}
            />
          )}

          {phase.webinarWeeks && (
            <WebinarCountdown
              weeks={phase.webinarWeeks}
              checkedItems={checkedItems}
              onToggle={onToggle}
              getProgress={getProgress}
            />
          )}

          {phase.monthlyCheckpoints && (
            <MonthlyCheckpoints
              columns={phase.monthlyCheckpoints}
              checkedItems={checkedItems}
              onToggle={onToggle}
              getProgress={getProgress}
            />
          )}
        </div>
      )}
    </div>
  );
}
