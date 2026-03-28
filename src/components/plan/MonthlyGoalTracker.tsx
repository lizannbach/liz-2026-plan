import { useState } from 'react';
import { MonthlyGoalSnapshot } from '@/lib/plan-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TrendingUp, Plus, ChevronDown } from 'lucide-react';

interface Props {
  snapshots: MonthlyGoalSnapshot[];
  onUpdate: (snapshots: MonthlyGoalSnapshot[]) => void;
}

const GOALS = {
  wildflowerRevenue:     { label: 'Wildflower Revenue', unit: '$', goal: 10000, format: (v: number) => `$${v.toLocaleString()}` },
  personalIGFollowers:   { label: 'Personal IG Followers', unit: '', goal: 10000, format: (v: number) => v.toLocaleString() },
  wildflowerIGFollowers: { label: 'Wildflower IG Followers', unit: '', goal: 5000, format: (v: number) => v.toLocaleString() },
  weight:                { label: 'Weight (lbs)', unit: 'lbs', goal: 135, format: (v: number) => `${v} lbs`, lowerIsBetter: true },
  downPaymentSaved:      { label: 'Down Payment Saved', unit: '$', goal: 44000, format: (v: number) => `$${v.toLocaleString()}` },
  emailSubscribers:      { label: 'Email Subscribers', unit: '', goal: 750, format: (v: number) => v.toLocaleString() },
} as const;

type MetricKey = keyof typeof GOALS;

function pct(value: number, goal: number, lowerIsBetter = false, start?: number) {
  if (lowerIsBetter && start !== undefined) {
    const progress = start - value;
    const total = start - goal;
    return Math.max(0, Math.min(100, Math.round((progress / total) * 100)));
  }
  return Math.max(0, Math.min(100, Math.round((value / goal) * 100)));
}

/** Returns "YYYY-MM" for monthly check-in snapshots */
function toMonthKey(year: number, month: number) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

function formatMonthLabel(iso: string) {
  // Handle both "YYYY-MM" and "YYYY-MM-DD" (for plan-start entry)
  const parts = iso.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const label = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  if (parts.length === 3) return `Plan Start (${label})`;
  return label;
}

/**
 * Returns the next check-in month key (YYYY-MM) — always the 1st of the next
 * month that doesn't already have a snapshot.
 */
function getNextCheckInKey(snapshots: MonthlyGoalSnapshot[]): { key: string; label: string; dueDate: string } {
  const monthKeys = new Set(
    snapshots.filter(s => s.month.length === 7).map(s => s.month)
  );
  const now = new Date();
  // Check-ins happen on the 1st; if we're past the 1st, start from next month
  let y = now.getFullYear();
  let m = now.getMonth() + 1; // 1-based
  if (now.getDate() > 1) { m++; if (m > 12) { m = 1; y++; } }
  for (let i = 0; i < 24; i++) {
    const key = toMonthKey(y, m);
    if (!monthKeys.has(key)) {
      const label = new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const dueDate = `${label.split(' ')[0]} 1`;
      return { key, label, dueDate };
    }
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return { key: toMonthKey(now.getFullYear(), now.getMonth() + 2), label: '', dueDate: '' };
}

export function MonthlyGoalTracker({ snapshots, onUpdate }: Props) {
  const sorted = [...snapshots].sort((a, b) => b.month.localeCompare(a.month));
  const latest = sorted[0];
  const nextCheckIn = getNextCheckInKey(snapshots);
  const existing = snapshots.find(s => s.month === nextCheckIn.key);

  const [isAdding, setIsAdding] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [form, setForm] = useState<Omit<MonthlyGoalSnapshot, 'month'>>({
    wildflowerRevenue: existing?.wildflowerRevenue ?? latest?.wildflowerRevenue ?? 0,
    personalIGFollowers: existing?.personalIGFollowers ?? latest?.personalIGFollowers ?? 0,
    wildflowerIGFollowers: existing?.wildflowerIGFollowers ?? latest?.wildflowerIGFollowers ?? 0,
    weight: existing?.weight ?? latest?.weight ?? 0,
    downPaymentSaved: existing?.downPaymentSaved ?? latest?.downPaymentSaved ?? 0,
    emailSubscribers: existing?.emailSubscribers ?? latest?.emailSubscribers ?? 0,
    notes: existing?.notes ?? '',
  });

  const saveSnapshot = () => {
    const snapshot: MonthlyGoalSnapshot = { month: nextCheckIn.key, ...form };
    const updated = existing
      ? snapshots.map(s => s.month === nextCheckIn.key ? snapshot : s)
      : [...snapshots, snapshot];
    onUpdate(updated.sort((a, b) => a.month.localeCompare(b.month)));
    setIsAdding(false);
  };

  const displaySnapshot = existing ?? latest;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-9">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-base text-foreground font-body">Monthly Goal Progress</h3>
        </div>
        {!isAdding && (
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            variant="outline"
            className="text-[0.78rem] h-7 gap-1"
          >
            <Plus className="w-3 h-3" />
            {existing ? 'Update' : 'Log'} {nextCheckIn.dueDate}
          </Button>
        )}
      </div>

      {/* Current snapshot — metric cards */}
      {displaySnapshot && !isAdding && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {(Object.keys(GOALS) as MetricKey[]).map(key => {
            const g = GOALS[key];
            const value = displaySnapshot[key] as number;
            const earliestWeight = sorted.length > 0 ? sorted[sorted.length - 1].weight : value;
            const p = pct(value, g.goal, 'lowerIsBetter' in g && g.lowerIsBetter, key === 'weight' ? earliestWeight : undefined);
            const isGoalMet = 'lowerIsBetter' in g && g.lowerIsBetter ? value <= g.goal : value >= g.goal;
            return (
              <div key={key} className="bg-background rounded-xl p-3 border border-border/60">
                <div className="text-[0.68rem] uppercase tracking-wide text-muted-foreground mb-1">{g.label}</div>
                <div className="text-[1rem] font-bold text-foreground mb-1.5">{g.format(value)}</div>
                <div className="bg-border rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isGoalMet ? 'bg-primary' : 'bg-primary/50'}`}
                    style={{ width: `${p}%` }}
                  />
                </div>
                <div className="text-[0.65rem] text-muted-foreground mt-1">{p}% → goal: {g.format(g.goal)}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Log form */}
      {isAdding && (
        <div className="space-y-3 mb-4">
          <p className="text-[0.8rem] text-muted-foreground italic">Logging {nextCheckIn.label} check-in — update only what's changed.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(Object.keys(GOALS) as MetricKey[]).map(key => (
              <div key={key}>
                <label className="text-[0.7rem] uppercase tracking-wide text-muted-foreground block mb-1">{GOALS[key].label}</label>
                <Input
                  type="number"
                  value={form[key]}
                  onChange={e => setForm(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                  className="h-8 text-[0.85rem]"
                  step={key === 'weight' ? '0.1' : '1'}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[0.7rem] uppercase tracking-wide text-muted-foreground block mb-1">Notes (optional)</label>
            <Textarea
              value={form.notes}
              onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="What happened this month? Any big wins or shifts?"
              className="text-[0.83rem] min-h-[60px] resize-none"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={saveSnapshot} size="sm" className="text-[0.82rem]">Save snapshot</Button>
            <Button onClick={() => setIsAdding(false)} size="sm" variant="ghost" className="text-[0.82rem]">Cancel</Button>
          </div>
        </div>
      )}

      {/* History */}
      {sorted.length > 1 && (
        <details onToggle={e => setShowHistory((e.target as HTMLDetailsElement).open)}>
          <summary className="text-[0.75rem] text-muted-foreground cursor-pointer flex items-center gap-1 hover:text-foreground">
            <ChevronDown className={`w-3 h-3 transition-transform ${showHistory ? 'rotate-180' : ''}`} />
            Progress history ({sorted.length} months)
          </summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-[0.75rem] border-collapse">
              <thead>
                <tr>
                  <th className="text-left text-muted-foreground font-normal py-1 pr-3 whitespace-nowrap">Month</th>
                  {(Object.keys(GOALS) as MetricKey[]).map(k => (
                    <th key={k} className="text-left text-muted-foreground font-normal py-1 pr-3 whitespace-nowrap">{GOALS[k].label}</th>
                  ))}
                  <th className="text-left text-muted-foreground font-normal py-1">Notes</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map(s => (
                  <tr key={s.month} className="border-t border-border/40">
                    <td className="py-1.5 pr-3 font-medium text-foreground whitespace-nowrap">{formatMonthLabel(s.month)}</td>
                    {(Object.keys(GOALS) as MetricKey[]).map(k => (
                      <td key={k} className="py-1.5 pr-3 text-foreground/80">{GOALS[k].format(s[k] as number)}</td>
                    ))}
                    <td className="py-1.5 text-muted-foreground italic">{s.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
