import { useRef } from 'react';
import { usePlanStore } from '@/hooks/use-plan-store';
import { RealityCheck } from '@/components/plan/RealityCheck';
import { SalesFunnel } from '@/components/plan/SalesFunnel';
import { DataTable } from '@/components/plan/DataTable';
import { NetworkBox } from '@/components/plan/NetworkBox';
import { MortgageBox } from '@/components/plan/MortgageBox';
import { PhaseSection } from '@/components/plan/PhaseSection';
import { ProgressBar } from '@/components/plan/ProgressBar';
import { DailyDashboard } from '@/components/plan/DailyDashboard';
import { WeightTracker } from '@/components/plan/WeightTracker';
import { ReflectionJournal } from '@/components/plan/ReflectionJournal';
import { CheckInBanner } from '@/components/plan/CheckInBanner';
import { MonthlyGoalTracker } from '@/components/plan/MonthlyGoalTracker';
import { WeekendMode } from '@/components/plan/WeekendMode';

const Index = () => {
  const { data, toggleCheck, updateDashboard, updateWeightLog, updateReflections, updateMonthlyGoals, getAllCheckableIds, getProgress } = usePlanStore();
  const allIds = getAllCheckableIds();
  const globalProgress = getProgress(allIds);
  const dashboardRef = useRef<HTMLDivElement>(null);

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      <div className="max-w-[840px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h1 className="font-heading text-[2rem] sm:text-[2.8rem] font-semibold text-foreground tracking-wide leading-tight">{data.title}</h1>
          <div className="text-base text-muted-foreground mt-2 italic">{data.subtitle}</div>
          <div className="mt-4 text-base text-muted-foreground/70 leading-relaxed max-w-[580px] mx-auto">{data.tagline}</div>
          {allIds.length > 0 && <ProgressBar {...globalProgress} global />}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              onClick={() => {
                const raw = localStorage.getItem('liz-2026-plan-react');
                if (!raw) return;
                const blob = new Blob([raw], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `liz-plan-backup-${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="text-[0.72rem] text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2"
            >
              Export backup
            </button>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <label className="text-[0.72rem] text-muted-foreground/50 hover:text-muted-foreground underline underline-offset-2 cursor-pointer">
              Restore backup
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = ev => {
                    try {
                      const text = ev.target?.result as string;
                      JSON.parse(text); // validate
                      localStorage.setItem('liz-2026-plan-react', text);
                      window.location.reload();
                    } catch {
                      alert('Invalid backup file.');
                    }
                  };
                  reader.readAsText(file);
                }}
              />
            </label>
          </div>
        </div>

        {/* Check-in banner */}
        <CheckInBanner
          lastUpdated={data.dashboard.lastUpdated ?? ''}
          onDismiss={scrollToDashboard}
        />

        {/* Daily Dashboard — Command Center */}
        <div ref={dashboardRef}>
          <DailyDashboard
            dashboard={data.dashboard}
            onUpdate={updateDashboard}
            phases={data.phases}
            checkedItems={data.checkedItems}
          />
        </div>

        {/* Weekend Mode */}
        <WeekendMode tasks={data.weekendTasks ?? []} />

        <div className="text-center text-muted-foreground/40 tracking-[8px] my-9">· · ·</div>

        {/* Weight Tracker */}
        <WeightTracker
          weightLog={data.dashboard.weightLog}
          weightGoal={data.weightGoal}
          onUpdate={updateWeightLog}
        />

        {/* Monthly Goal Tracker */}
        <MonthlyGoalTracker
          snapshots={data.monthlyGoals ?? []}
          onUpdate={updateMonthlyGoals}
        />

        {/* Reflections */}
        <ReflectionJournal
          reflections={data.dashboard.reflections}
          onUpdate={updateReflections}
        />

        <div className="text-center text-muted-foreground/40 tracking-[8px] my-9">· · ·</div>

        {/* Alert */}
        <div className="bg-[hsl(40,18%,94%)] border-2 border-primary rounded-[14px] p-5 mb-9 flex gap-4 items-start">
          <div className="text-2xl flex-shrink-0">⏳</div>
          <div>
            <h3 className="text-base text-foreground mb-1.5 font-body">{data.alert.title}</h3>
            <p className="text-[0.88rem] text-slate leading-relaxed">{data.alert.body}</p>
          </div>
        </div>

        {/* Reality Check */}
        <RealityCheck cards={data.realityCards} />

        <div className="text-center text-muted-foreground/40 tracking-[8px] my-9">· · ·</div>

        {/* Wildflower Math */}
        <p className="text-[0.75rem] uppercase tracking-[1.2px] text-muted-foreground mb-3.5">The Wildflower Math</p>
        <SalesFunnel steps={data.funnelSteps} tiers={data.funnelTiers} note={data.funnelNote} />
        <DataTable header={data.mathTable.header} columns={data.mathTable.columns} rows={data.mathTable.rows} note={data.mathTable.note} />

        {/* Network */}
        <NetworkBox contacts={data.networkContacts} />

        {/* Income */}
        <p className="text-[0.75rem] uppercase tracking-[1.2px] text-muted-foreground mb-3.5">How Liz Hits $10k/Month Post-Tax</p>
        <DataTable header={data.incomeTable.header} sub={data.incomeTable.sub} columns={data.incomeTable.columns} rows={data.incomeTable.rows} />

        {/* Mortgage */}
        <MortgageBox {...data.mortgage} />

        <div className="text-center text-muted-foreground/40 tracking-[8px] my-9">· · ·</div>

        {/* Phases */}
        {data.phases.map(phase => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            checkedItems={data.checkedItems}
            onToggle={toggleCheck}
            getProgress={getProgress}
          />
        ))}

        <div className="text-center text-muted-foreground/40 tracking-[8px] my-9">· · ·</div>

        {/* Mindset */}
        <div className="bg-card border border-border rounded-[14px] p-7 text-center">
          <h2 className="text-[1.05rem] text-foreground mb-3 font-body font-normal">{data.mindset.title}</h2>
          <p className="text-[0.9rem] text-muted-foreground leading-relaxed max-w-[580px] mx-auto">{data.mindset.body}</p>
          <p className="text-muted-foreground/30 text-[0.8rem] mt-6">Liz · Wildflower Social Media · 2026</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
