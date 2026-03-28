import { useState } from 'react';
import { Reflection, generateId } from '@/lib/plan-types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, Sparkles } from 'lucide-react';
import { getDailyPrompt, getWeeklyPrompt, getMonthlyPrompt } from '@/lib/reflection-prompts';

interface Props {
  reflections: Reflection[];
  onUpdate: (reflections: Reflection[]) => void;
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getWeekLabel(date: string) {
  const d = new Date(date + 'T12:00:00');
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  return `Week of ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

function getMonthLabel(date: string) {
  const d = new Date(date + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export function ReflectionJournal({ reflections, onUpdate }: Props) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [draft, setDraft] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const today = getTodayISO();

  const promptForTab = {
    daily: getDailyPrompt(today),
    weekly: getWeeklyPrompt(today),
    monthly: getMonthlyPrompt(today),
  };

  const filtered = reflections
    .filter(r => r.type === activeTab)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Check if there's already an entry for today/this week/this month
  const todayEntry = filtered.find(r => r.date === today);

  const saveReflection = () => {
    if (!draft.trim()) return;
    if (todayEntry) {
      const updated = reflections.map(r => r.id === todayEntry.id ? { ...r, content: draft } : r);
      onUpdate(updated);
    } else {
      const entry: Reflection = { id: generateId(), date: today, type: activeTab, content: draft.trim() };
      onUpdate([...reflections, entry]);
    }
    setDraft('');
  };

  const tabLabel = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  const placeholder = {
    daily: "What moved the needle today? What got in the way? What am I proud of?",
    weekly: "What were the wins this week? What needs to change next week? Am I on track with my priorities?",
    monthly: "Big picture: what changed this month? Where am I vs. my goals? What needs a course correction?",
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-7 mb-9">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-primary" />
        <h3 className="text-base text-foreground font-body">Reflections</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-background rounded-lg p-1 mb-4">
        {(['daily', 'weekly', 'monthly'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setDraft(''); setShowPrompt(false); }}
            className={`flex-1 text-[0.82rem] py-1.5 rounded-md transition-colors ${
              activeTab === tab
                ? 'bg-primary text-primary-foreground font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </div>

      {/* Today's prompt */}
      <div className="mb-3">
        <button
          onClick={() => setShowPrompt(p => !p)}
          className="flex items-center gap-1.5 text-[0.78rem] text-primary/80 hover:text-primary transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          {showPrompt ? 'Hide' : "Today's prompt"}
        </button>
        {showPrompt && (
          <div className="mt-2 bg-primary/5 border border-primary/20 rounded-lg px-3.5 py-2.5 text-[0.85rem] text-foreground/80 leading-relaxed italic">
            {promptForTab[activeTab]}
          </div>
        )}
      </div>

      {/* Input */}
      <Textarea
        value={draft || (todayEntry?.content ?? '')}
        onChange={e => setDraft(e.target.value)}
        placeholder={placeholder[activeTab]}
        className="text-[0.85rem] min-h-[100px] resize-none mb-2"
      />
      <Button onClick={saveReflection} size="sm" variant="outline" className="text-[0.82rem]">
        {todayEntry ? 'Update' : 'Save'} {tabLabel[activeTab]} Reflection
      </Button>

      {/* Past entries */}
      {filtered.length > 0 && (
        <details className="mt-4">
          <summary className="text-[0.78rem] text-muted-foreground cursor-pointer hover:text-foreground flex items-center gap-1">
            <ChevronDown className="w-3 h-3" />
            Past {tabLabel[activeTab].toLowerCase()} reflections ({filtered.length})
          </summary>
          <div className="mt-2 space-y-3 max-h-[300px] overflow-y-auto">
            {filtered.map(r => (
              <div key={r.id} className="border-l-2 border-primary/20 pl-3 py-1">
                <div className="text-[0.72rem] text-muted-foreground mb-0.5">
                  {activeTab === 'daily' && new Date(r.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  {activeTab === 'weekly' && getWeekLabel(r.date)}
                  {activeTab === 'monthly' && getMonthLabel(r.date)}
                </div>
                <p className="text-[0.83rem] text-foreground/80 leading-relaxed whitespace-pre-wrap">{r.content}</p>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
