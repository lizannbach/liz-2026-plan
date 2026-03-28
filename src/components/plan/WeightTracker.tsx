import { useState } from 'react';
import { WeightEntry } from '@/lib/plan-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  weightLog: WeightEntry[];
  weightGoal: { title: string; body: string; milestones: string[] };
  onUpdate: (log: WeightEntry[]) => void;
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function WeightTracker({ weightLog, weightGoal, onUpdate }: Props) {
  const [newWeight, setNewWeight] = useState('');
  const sorted = [...weightLog].sort((a, b) => b.date.localeCompare(a.date));
  const latest = sorted[0];
  const startWeight = 158;
  const goalWeight = 135;

  const logWeight = () => {
    const w = parseFloat(newWeight);
    if (isNaN(w) || w < 80 || w > 300) return;
    const today = getTodayISO();
    const existing = weightLog.findIndex(e => e.date === today);
    let updated: WeightEntry[];
    if (existing >= 0) {
      updated = weightLog.map((e, i) => i === existing ? { ...e, weight: w } : e);
    } else {
      updated = [...weightLog, { date: today, weight: w }];
    }
    onUpdate(updated);
    setNewWeight('');
  };

  const currentWeight = latest?.weight ?? startWeight;
  const totalToLose = startWeight - goalWeight;
  const lost = startWeight - currentWeight;
  const pct = Math.max(0, Math.min(100, Math.round((lost / totalToLose) * 100)));

  return (
    <div className="bg-gradient-to-br from-[hsl(40,20%,90%)] to-[hsl(90,14%,89%)] border border-border rounded-[14px] p-5 flex flex-col sm:flex-row gap-5 items-start my-9">
      <div className="text-3xl flex-shrink-0">⚖️</div>
      <div className="flex-1 w-full">
        <h3 className="text-[0.95rem] font-bold text-foreground mb-1">{weightGoal.title}</h3>
        <p className="text-[0.85rem] text-muted-foreground leading-relaxed mb-2">{weightGoal.body}</p>

        {/* Progress bar */}
        <div className="bg-border rounded-full h-2 overflow-hidden mb-1.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-foreground transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-[0.73rem] text-muted-foreground mb-3">
          {weightGoal.milestones.map((m, i) => <span key={i}>{m}</span>)}
        </div>

        {/* Current + log */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-card border border-border rounded-lg px-3 py-1.5">
            <span className="text-[0.72rem] text-muted-foreground">Current: </span>
            <span className="text-[0.9rem] font-bold text-foreground">{currentWeight} lbs</span>
            {latest && <span className="text-[0.72rem] text-muted-foreground ml-1">({latest.date})</span>}
          </div>
          <div className="flex gap-1.5 items-center">
            <Scale className="w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="number"
              value={newWeight}
              onChange={e => setNewWeight(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && logWeight()}
              placeholder="Log weight"
              className="w-24 text-[0.85rem] h-7"
              step="0.1"
            />
            <Button onClick={logWeight} size="sm" variant="outline" className="h-7 text-[0.78rem]">Log</Button>
          </div>
        </div>

        {/* Chart */}
        {sorted.length > 1 && (
          <div className="mt-4">
            <p className="text-[0.72rem] text-muted-foreground mb-2">Progress over time</p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={[...sorted].reverse()} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  tickFormatter={d => {
                    const dt = new Date(d + 'T12:00:00');
                    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                <Tooltip
                  formatter={(v: number) => [`${v} lbs`, 'Weight']}
                  labelFormatter={d => new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  contentStyle={{ fontSize: 12 }}
                />
                <ReferenceLine y={goalWeight} stroke="hsl(var(--primary))" strokeDasharray="4 2" label={{ value: 'Goal', fontSize: 10, fill: 'hsl(var(--primary))' }} />
                <Line type="monotone" dataKey="weight" stroke="hsl(var(--foreground))" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
