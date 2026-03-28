export interface RealityCard {
  id: string;
  label: string;
  current: string;
  goal: string;
  gap: string;
}

export interface ActionItem {
  id: string;
  text: string;
  type: 'normal' | 'urgent' | 'money';
  checked: boolean;
  weekdayOnly?: boolean;
}

export interface WeekendTask {
  id: string;
  text: string;
  category: string;
}

export interface ActionGroup {
  id: string;
  icon: string;
  title: string;
  items: ActionItem[];
}

export interface FunnelStep {
  price: string;
  name: string;
  type: string;
}

export interface FunnelTier {
  badge: string;
  price: string;
  name: string;
  desc: string;
  tag: string;
  style: 'group' | 'one' | 'mgmt';
}

export interface TableRow {
  cells: string[];
  highlight?: boolean;
  warning?: boolean;
  total?: boolean;
}

export interface DailyPart {
  id: string;
  label: string;
  wide?: boolean;
  items: { id: string; text: string; checked: boolean }[];
}

export interface DailyAddon {
  id: string;
  icon: string;
  title: string;
  desc: string;
  checked: boolean;
  schedule?: 'daily' | 'weekdays' | 'weekends';
}

export interface WeeklyArea {
  id: string;
  title: string;
  color: string;
  items: { id: string; text: string; checked: boolean }[];
}

export interface WebinarWeek {
  id: string;
  label: string;
  content: string;
  isEvent?: boolean;
  checked: boolean;
}

export interface MonthlyColumn {
  id: string;
  header: string;
  items: { id: string; text: string; checked: boolean }[];
}

export interface Phase {
  id: string;
  number: number;
  title: string;
  dates: string;
  focus: string;
  intro: string;
  colorClass: string;
  actionGroups: ActionGroup[];
  milestone: string;
  dailyParts?: DailyPart[];
  dailyAddons?: DailyAddon[];
  weeklyAreas?: WeeklyArea[];
  webinarWeeks?: WebinarWeek[];
  monthlyCheckpoints?: MonthlyColumn[];
  webinarCallout?: { date: string; title: string; body: string; bullets: string[] };
  countdownNote?: string;
}

export interface NetworkContact {
  name: string;
  sub: string;
  desc: string;
}

// --- New types for Daily Dashboard ---

export interface PriorityItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface OneOffTask {
  id: string;
  text: string;
  note: string;
  completed: boolean;
  createdAt: string;
}

export interface ClientTask {
  id: string;
  client: string;
  task: string;
  dueDate: string;
  completed: boolean;
}

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface Reflection {
  id: string;
  date: string;
  type: 'daily' | 'weekly' | 'monthly';
  content: string;
}

export interface MonthlyGoalSnapshot {
  month: string; // "2026-03" ISO year-month
  wildflowerRevenue: number;
  personalIGFollowers: number;
  wildflowerIGFollowers: number;
  weight: number;
  downPaymentSaved: number;
  emailSubscribers: number;
  notes: string;
}

export interface DailyDashboard {
  priorities: PriorityItem[];
  oneOffTasks: OneOffTask[];
  clientTasks: ClientTask[];
  weightLog: WeightEntry[];
  reflections: Reflection[];
  lastPriorityReset: string; // ISO date string
  lastUpdated: string; // ISO date string — set whenever dashboard is saved
  dailyResetDate: string; // ISO date — daily habits were last reset on this date
  weeklyResetDate: string; // ISO week string "YYYY-Www" — weekly habits were last reset this week
}

export interface PlanData {
  monthlyGoals: MonthlyGoalSnapshot[];
  title: string;
  subtitle: string;
  tagline: string;
  alert: { title: string; body: string };
  realityCards: RealityCard[];
  funnelSteps: FunnelStep[];
  funnelTiers: FunnelTier[];
  funnelNote: string;
  mathTable: { header: string; columns: string[]; rows: TableRow[]; note: string };
  networkContacts: NetworkContact[];
  incomeTable: { header: string; sub: string; columns: string[]; rows: TableRow[] };
  mortgage: { title: string; cards: { label: string; value: string; note: string }[]; body: string };
  phases: Phase[];
  weightGoal: { title: string; body: string; milestones: string[] };
  mindset: { title: string; body: string };
  weekendTasks: WeekendTask[];
  checkedItems: Record<string, boolean>;
  dashboard: DailyDashboard;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
