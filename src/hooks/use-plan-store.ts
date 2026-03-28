import { useState, useCallback } from 'react';
import { PlanData, DailyDashboard, WeightEntry, Reflection, MonthlyGoalSnapshot } from '@/lib/plan-types';
import { defaultPlanData } from '@/lib/plan-defaults';

const STORE_KEY = 'liz-2026-plan-react';

function isoWeek(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const w1 = new Date(d.getFullYear(), 0, 4);
  const wn = 1 + Math.round(((d.getTime() - w1.getTime()) / 86400000 - 3 + (w1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${String(wn).padStart(2, '0')}`;
}

function load(): PlanData {
  try {
    const s = localStorage.getItem(STORE_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      // Migrate old data without dashboard
      if (!parsed.dashboard) parsed.dashboard = defaultPlanData.dashboard;
      if (parsed.dashboard.lastUpdated === undefined) parsed.dashboard.lastUpdated = '';
      if (parsed.dashboard.dailyResetDate === undefined) parsed.dashboard.dailyResetDate = '';
      if (parsed.dashboard.weeklyResetDate === undefined) parsed.dashboard.weeklyResetDate = '';
      if (!parsed.monthlyGoals) parsed.monthlyGoals = defaultPlanData.monthlyGoals;
      if (!parsed.weekendTasks) parsed.weekendTasks = defaultPlanData.weekendTasks;

      // Collect daily and weekly habit IDs from phase data
      const dailyIds = new Set<string>();
      const weeklyIds = new Set<string>();
      (parsed.phases ?? []).forEach((phase: any) => {
        phase.dailyParts?.forEach((part: any) => part.items?.forEach((i: any) => dailyIds.add(i.id)));
        phase.dailyAddons?.forEach((a: any) => dailyIds.add(a.id));
        phase.weeklyAreas?.forEach((area: any) => area.items?.forEach((i: any) => weeklyIds.add(i.id)));
      });

      const today = new Date().toISOString().slice(0, 10);
      const thisWeek = isoWeek(new Date());

      if (parsed.dashboard.dailyResetDate !== today) {
        dailyIds.forEach(id => { delete parsed.checkedItems[id]; });
        parsed.dashboard.dailyResetDate = today;
      }
      if (parsed.dashboard.weeklyResetDate !== thisWeek) {
        weeklyIds.forEach(id => { delete parsed.checkedItems[id]; });
        parsed.dashboard.weeklyResetDate = thisWeek;
      }

      save(parsed); // persist the reset
      return parsed;
    }
  } catch {}
  return defaultPlanData;
}

function save(data: PlanData) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

export function usePlanStore() {
  const [data, setData] = useState<PlanData>(load);

  const update = useCallback((updater: (prev: PlanData) => PlanData) => {
    setData(prev => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const toggleCheck = useCallback((id: string) => {
    update(prev => ({
      ...prev,
      checkedItems: { ...prev.checkedItems, [id]: !prev.checkedItems[id] }
    }));
  }, [update]);

  const updateField = useCallback((path: string, value: string) => {
    update(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, [update]);

  const updateDashboard = useCallback((dashboard: DailyDashboard) => {
    const today = new Date().toISOString().slice(0, 10);
    update(prev => ({ ...prev, dashboard: { ...dashboard, lastUpdated: today } }));
  }, [update]);

  const updateWeightLog = useCallback((weightLog: WeightEntry[]) => {
    update(prev => ({ ...prev, dashboard: { ...prev.dashboard, weightLog } }));
  }, [update]);

  const updateReflections = useCallback((reflections: Reflection[]) => {
    update(prev => ({ ...prev, dashboard: { ...prev.dashboard, reflections } }));
  }, [update]);

  const getAllCheckableIds = useCallback((): string[] => {
    const ids: string[] = [];
    data.phases.forEach(phase => {
      phase.actionGroups.forEach(group => {
        group.items.forEach(item => ids.push(item.id));
      });
      phase.dailyParts?.forEach(part => {
        part.items.forEach(item => ids.push(item.id));
      });
      phase.dailyAddons?.forEach(addon => ids.push(addon.id));
      phase.weeklyAreas?.forEach(area => {
        area.items.forEach(item => ids.push(item.id));
      });
      phase.webinarWeeks?.forEach(week => ids.push(week.id));
      phase.monthlyCheckpoints?.forEach(col => {
        col.items.forEach(item => ids.push(item.id));
      });
    });
    return ids;
  }, [data]);

  const updateMonthlyGoals = useCallback((monthlyGoals: MonthlyGoalSnapshot[]) => {
    update(prev => ({ ...prev, monthlyGoals }));
  }, [update]);

  const getProgress = useCallback((ids: string[]): { done: number; total: number; pct: number } => {
    const total = ids.length;
    const done = ids.filter(id => data.checkedItems[id]).length;
    return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  }, [data.checkedItems]);

  return { data, update, toggleCheck, updateField, updateDashboard, updateWeightLog, updateReflections, updateMonthlyGoals, getAllCheckableIds, getProgress };
}
