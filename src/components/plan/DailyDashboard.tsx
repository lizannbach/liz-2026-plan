import { useState } from 'react';
import { DailyDashboard as DashboardType, PriorityItem, OneOffTask, ClientTask, Phase, generateId } from '@/lib/plan-types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, ChevronDown, ChevronUp, Star, Briefcase, ListTodo, Sparkles } from 'lucide-react';
import { getSuggestedTasks, SuggestedTask } from '@/lib/suggested-tasks';

interface Props {
  dashboard: DashboardType;
  onUpdate: (dashboard: DashboardType) => void;
  phases?: Phase[];
  checkedItems?: Record<string, boolean>;
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function DailyDashboard({ dashboard, onUpdate, phases = [], checkedItems = {} }: Props) {
  const [newPriority, setNewPriority] = useState('');
  const [newTask, setNewTask] = useState('');
  const [newClientName, setNewClientName] = useState('');
  const [newClientTask, setNewClientTask] = useState('');
  const [newClientDue, setNewClientDue] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const today = getTodayISO();

  // Auto-reset priorities if it's a new day
  const shouldReset = dashboard.lastPriorityReset !== today;
  const priorities = shouldReset
    ? dashboard.priorities.map(p => ({ ...p, completed: false }))
    : dashboard.priorities;

  if (shouldReset && dashboard.priorities.length > 0) {
    onUpdate({ ...dashboard, priorities, lastPriorityReset: today });
  }

  // Priority handlers
  const addPriority = () => {
    if (!newPriority.trim() || priorities.length >= 5) return;
    const updated: PriorityItem[] = [...priorities, { id: generateId(), text: newPriority.trim(), completed: false }];
    onUpdate({ ...dashboard, priorities: updated, lastPriorityReset: today });
    setNewPriority('');
  };

  const togglePriority = (id: string) => {
    const updated = priorities.map(p => p.id === id ? { ...p, completed: !p.completed } : p);
    onUpdate({ ...dashboard, priorities: updated });
  };

  const removePriority = (id: string) => {
    onUpdate({ ...dashboard, priorities: priorities.filter(p => p.id !== id) });
  };

  // One-off task handlers
  const addOneOff = () => {
    if (!newTask.trim()) return;
    const task: OneOffTask = { id: generateId(), text: newTask.trim(), note: '', completed: false, createdAt: today };
    onUpdate({ ...dashboard, oneOffTasks: [...dashboard.oneOffTasks, task] });
    setNewTask('');
  };

  const toggleOneOff = (id: string) => {
    const updated = dashboard.oneOffTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    onUpdate({ ...dashboard, oneOffTasks: updated });
  };

  const updateOneOffNote = (id: string, note: string) => {
    const updated = dashboard.oneOffTasks.map(t => t.id === id ? { ...t, note } : t);
    onUpdate({ ...dashboard, oneOffTasks: updated });
  };

  const removeOneOff = (id: string) => {
    onUpdate({ ...dashboard, oneOffTasks: dashboard.oneOffTasks.filter(t => t.id !== id) });
  };

  // Client task handlers
  const addClientTask = () => {
    if (!newClientName.trim() || !newClientTask.trim()) return;
    const task: ClientTask = { id: generateId(), client: newClientName.trim(), task: newClientTask.trim(), dueDate: newClientDue || today, completed: false };
    onUpdate({ ...dashboard, clientTasks: [...dashboard.clientTasks, task] });
    setNewClientName('');
    setNewClientTask('');
    setNewClientDue('');
  };

  const toggleClientTask = (id: string) => {
    const updated = dashboard.clientTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    onUpdate({ ...dashboard, clientTasks: updated });
  };

  const removeClientTask = (id: string) => {
    onUpdate({ ...dashboard, clientTasks: dashboard.clientTasks.filter(t => t.id !== id) });
  };

  const pendingOneOffs = dashboard.oneOffTasks.filter(t => !t.completed);
  const completedOneOffs = dashboard.oneOffTasks.filter(t => t.completed);
  const pendingClient = dashboard.clientTasks.filter(t => !t.completed);
  const completedClient = dashboard.clientTasks.filter(t => t.completed);

  const suggestions = phases.length > 0
    ? getSuggestedTasks(phases, checkedItems, dashboard.oneOffTasks)
    : [];

  const addSuggestion = (suggestion: SuggestedTask) => {
    const task: OneOffTask = {
      id: generateId(),
      text: suggestion.text,
      note: `From: ${suggestion.groupTitle}`,
      completed: false,
      createdAt: today,
    };
    onUpdate({ ...dashboard, oneOffTasks: [...dashboard.oneOffTasks, task] });
  };

  return (
    <div className="mb-9">
      <div className="text-center mb-6">
        <h2 className="font-heading text-3xl font-semibold text-foreground mb-1">Today's Command Center</h2>
        <p className="text-[0.9rem] text-muted-foreground italic">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Priorities */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-primary" />
            <h3 className="text-[0.85rem] uppercase tracking-wider text-foreground font-bold">Top 5 Priorities</h3>
          </div>
          <p className="text-[0.78rem] text-muted-foreground italic mb-3">What moves the needle today? Focus on inputs you control.</p>

          <div className="space-y-2 mb-3">
            {priorities.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-start gap-2 p-2 rounded-lg transition-all cursor-pointer hover:bg-primary/5 group ${p.completed ? 'opacity-40' : ''}`}
              >
                <span
                  onClick={() => togglePriority(p.id)}
                  className="text-primary/50 text-base flex-shrink-0 mt-0.5"
                >
                  {p.completed ? '✓' : '□'}
                </span>
                <span
                  onClick={() => togglePriority(p.id)}
                  className={`text-[0.88rem] text-foreground flex-1 ${p.completed ? 'line-through' : ''}`}
                >
                  <span className="text-primary font-bold mr-1.5">#{i + 1}</span>
                  {p.text}
                </span>
                <button onClick={() => removePriority(p.id)} className="text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {priorities.length < 5 && (
            <div className="flex gap-2">
              <Input
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addPriority()}
                placeholder={`Priority #${priorities.length + 1}...`}
                className="text-[0.85rem] h-8"
              />
              <Button onClick={addPriority} size="sm" variant="outline" className="h-8 px-2">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}

          {priorities.length >= 5 && (
            <p className="text-[0.75rem] text-muted-foreground/60 text-center">5 priorities set — that's your focus today.</p>
          )}
        </div>

        {/* Client Work */}
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Briefcase className="w-4 h-4 text-primary" />
            <h3 className="text-[0.85rem] uppercase tracking-wider text-foreground font-bold">Client Work</h3>
          </div>
          <p className="text-[0.78rem] text-muted-foreground italic mb-3">Track what's due for each client — today or upcoming.</p>

          <div className="space-y-1.5 mb-3">
            {pendingClient.map(t => (
              <div
                key={t.id}
                onClick={() => toggleClientTask(t.id)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-primary/5 group"
              >
                <span className="text-primary/50 text-base flex-shrink-0">□</span>
                <div className="flex-1 min-w-0">
                  <span className="text-[0.78rem] text-primary font-bold">{t.client}</span>
                  <span className="text-[0.85rem] text-foreground ml-1.5">{t.task}</span>
                </div>
                {t.dueDate && (
                  <span className="text-[0.72rem] text-muted-foreground flex-shrink-0">{t.dueDate}</span>
                )}
                <button onClick={e => { e.stopPropagation(); removeClientTask(t.id); }} className="text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {completedClient.map(t => (
              <div
                key={t.id}
                onClick={() => toggleClientTask(t.id)}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer opacity-40"
              >
                <span className="text-primary text-base flex-shrink-0">✓</span>
                <span className="text-[0.85rem] text-foreground line-through">{t.client}: {t.task}</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 border-t border-border/50 pt-3">
            <div className="flex gap-2">
              <Input
                value={newClientName}
                onChange={e => setNewClientName(e.target.value)}
                placeholder="Client name"
                className="text-[0.85rem] h-8 w-1/3"
              />
              <Input
                value={newClientTask}
                onChange={e => setNewClientTask(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addClientTask()}
                placeholder="What needs to be done"
                className="text-[0.85rem] h-8 flex-1"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label className="text-[0.72rem] text-muted-foreground flex-shrink-0">Due</label>
              <Input
                type="date"
                value={newClientDue}
                onChange={e => setNewClientDue(e.target.value)}
                className="text-[0.82rem] h-8 flex-1"
              />
              <Button onClick={addClientTask} size="sm" variant="outline" className="h-8 px-2 flex-shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>

        {/* One-off Tasks */}
        <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <ListTodo className="w-4 h-4 text-primary" />
            <h3 className="text-[0.85rem] uppercase tracking-wider text-foreground font-bold">One-Off Tasks</h3>
            <span className="text-[0.72rem] text-muted-foreground ml-auto">{pendingOneOffs.length} pending</span>
          </div>
          <p className="text-[0.78rem] text-muted-foreground italic mb-3">These persist until you complete them. Add notes for context.</p>

          <div className="space-y-1.5 mb-3">
            {pendingOneOffs.map(t => (
              <div key={t.id} className="group">
                <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5">
                  <span
                    onClick={() => toggleOneOff(t.id)}
                    className="text-primary/50 text-base flex-shrink-0 cursor-pointer"
                  >□</span>
                  <span
                    onClick={() => toggleOneOff(t.id)}
                    className="text-[0.85rem] text-foreground flex-1 cursor-pointer"
                  >{t.text}</span>
                  <button onClick={() => setExpandedTaskId(expandedTaskId === t.id ? null : t.id)} className="text-muted-foreground/40 hover:text-primary">
                    {expandedTaskId === t.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => removeOneOff(t.id)} className="text-muted-foreground/30 hover:text-destructive opacity-0 group-hover:opacity-100">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                {expandedTaskId === t.id && (
                  <div className="pl-8 pr-2 pb-2">
                    <Textarea
                      value={t.note}
                      onChange={e => updateOneOffNote(t.id, e.target.value)}
                      placeholder="Add context or notes..."
                      className="text-[0.82rem] min-h-[60px] resize-none"
                    />
                  </div>
                )}
              </div>
            ))}
            {completedOneOffs.length > 0 && (
              <details className="mt-2">
                <summary className="text-[0.78rem] text-muted-foreground cursor-pointer hover:text-foreground">
                  {completedOneOffs.length} completed
                </summary>
                {completedOneOffs.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-2 opacity-40">
                    <span onClick={() => toggleOneOff(t.id)} className="text-primary text-base flex-shrink-0 cursor-pointer">✓</span>
                    <span className="text-[0.85rem] text-foreground line-through">{t.text}</span>
                    <button onClick={() => removeOneOff(t.id)} className="text-muted-foreground/30 hover:text-destructive ml-auto">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </details>
            )}
          </div>

          {/* Suggested from plan */}
          {suggestions.length > 0 && (
            <div className="mb-3 border-t border-border/50 pt-3">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3 h-3 text-primary/70" />
                <span className="text-[0.72rem] uppercase tracking-wide text-muted-foreground">Suggested from your plan</span>
              </div>
              <div className="space-y-1">
                {suggestions.map(s => (
                  <div key={s.id} className="flex items-start gap-2 group">
                    <button
                      onClick={() => addSuggestion(s)}
                      className="flex-shrink-0 mt-0.5 text-primary/40 hover:text-primary transition-colors"
                      title="Add to tasks"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`text-[0.82rem] leading-snug ${s.type === 'urgent' ? 'text-foreground' : 'text-foreground/70'}`}>
                        {s.type === 'urgent' && <span className="text-[0.7rem] mr-1">🔥</span>}
                        {s.type === 'money' && <span className="text-primary font-bold text-[0.7rem] mr-1">$</span>}
                        {s.text}
                      </span>
                      <span className="block text-[0.68rem] text-muted-foreground/60">{s.groupTitle}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addOneOff()}
              placeholder="Add a one-off task..."
              className="text-[0.85rem] h-8"
            />
            <Button onClick={addOneOff} size="sm" variant="outline" className="h-8 px-2">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
