import { Phase, OneOffTask } from './plan-types';

// Maps month name to 0-based index
const MONTH_MAP: Record<string, number> = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

/**
 * Parse a phase dates string like "March – May 2026 · ~3 months"
 * and return { start: Date, end: Date } for the phase window.
 */
function parsePhaseDates(datesStr: string): { start: Date; end: Date } | null {
  // e.g. "March – May 2026 · ~3 months"
  const match = datesStr.match(/(\w+)\s*[–-]\s*(\w+)\s+(\d{4})/);
  if (!match) return null;
  const [, startMonth, endMonth, year] = match;
  const y = parseInt(year);
  const sm = MONTH_MAP[startMonth.toLowerCase()];
  const em = MONTH_MAP[endMonth.toLowerCase()];
  if (sm === undefined || em === undefined) return null;
  return {
    start: new Date(y, sm, 1),
    end: new Date(y, em + 1, 0), // last day of end month
  };
}

/**
 * Find the currently active phase based on today's date.
 * Falls back to the first phase if none match (e.g., before plan start).
 */
export function getCurrentPhase(phases: Phase[]): Phase {
  const today = new Date();
  for (const phase of phases) {
    const range = parsePhaseDates(phase.dates);
    if (range && today >= range.start && today <= range.end) return phase;
  }
  // If we're past all phases, return the last one
  // If we're before all phases, return the first one
  return phases[0];
}

export interface SuggestedTask {
  id: string;
  text: string;
  type: 'urgent' | 'money' | 'normal';
  phaseTitle: string;
  groupTitle: string;
}

/**
 * Return unchecked action items from the current phase, prioritized by type.
 * Filters out anything already present in existing one-off tasks.
 */
function isWeekend(): boolean {
  const day = new Date().getDay();
  return day === 0 || day === 6;
}

export function getSuggestedTasks(
  phases: Phase[],
  checkedItems: Record<string, boolean>,
  existingTasks: OneOffTask[],
  limit = 5,
): SuggestedTask[] {
  const currentPhase = getCurrentPhase(phases);
  const existingTexts = new Set(existingTasks.map(t => t.text.trim().toLowerCase()));
  const weekend = isWeekend();

  const candidates: SuggestedTask[] = [];

  for (const group of currentPhase.actionGroups) {
    for (const item of group.items) {
      if (checkedItems[item.id]) continue; // already done
      if (existingTexts.has(item.text.trim().toLowerCase())) continue; // already in tasks
      if (weekend && item.weekdayOnly) continue; // skip business tasks on weekends
      candidates.push({
        id: item.id,
        text: item.text,
        type: item.type,
        phaseTitle: currentPhase.title,
        groupTitle: group.title,
      });
    }
  }

  // Sort: urgent first, then money, then normal
  const order = { urgent: 0, money: 1, normal: 2 };
  candidates.sort((a, b) => order[a.type] - order[b.type]);

  return candidates.slice(0, limit);
}
