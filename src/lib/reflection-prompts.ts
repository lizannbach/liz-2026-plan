// Curated daily reflection prompts tailored to Liz's 2026 goals.
// Prompts rotate by day-of-year so you get a different one each day.

const DAILY_PROMPTS = [
  // Business / Wildflower growth
  "What's one concrete action you took today to move closer to a new Wildflower client?",
  "If you had to pitch Wildflower's value in one sentence to a stranger today, what would you say?",
  "What's the biggest objection you're getting from prospects right now — and how are you handling it?",
  "Are you spending your time today on lead generation, or just staying busy? What's the difference?",
  "Think about your best current client. What made them say yes? How can you recreate that with someone new?",
  "What's one thing you did today to build your personal brand on Instagram or LinkedIn?",
  "The CCBB contract ends in September. Are you building the pipeline that replaces it, or waiting?",
  "Name one person in your network you could reach out to this week about Wildflower. What would you say?",
  "What does $10k/month actually look like broken down into clients and services? How close are you today?",
  "What would a version of you who already hits $10k/month do differently tomorrow morning?",

  // Mindset / focus
  "What distracted you most today? How can you protect yourself from that tomorrow?",
  "What's the hardest thing you're avoiding right now — and why?",
  "On a scale of 1–10, how aligned was today with your priorities? What shifted it up or down?",
  "What did you do today that your future self will thank you for?",
  "What story are you telling yourself about why something hasn't happened yet? Is it true?",
  "What would you do differently today if you knew September was already here?",
  "What's one win — no matter how small — from today that deserves a moment of recognition?",
  "Where did you show up fully for yourself today? Where did you phone it in?",
  "What belief is holding you back from charging more for your services?",
  "If you weren't afraid, what would you do next to grow Wildflower?",

  // Health / weight
  "Did your choices today move you toward 135 lbs or away from it? No judgment — just honest.",
  "What's one habit that, if done consistently for 30 days, would change your health trajectory?",
  "How are your energy levels tracking this week? What's influencing them?",
  "What's the connection between how you're feeling physically and how you're showing up for work?",
  "What did you eat today that you're proud of? What would you do differently?",
  "Rest and recovery are part of the plan. Did you give yourself permission to rest today?",
  "What's one small movement or activity that felt good to your body recently?",
  "How does your confidence shift when you're consistent with your health habits? Notice that.",

  // Mortgage / financial
  "What's your current Wildflower revenue this month? Are you on track for your income goal?",
  "What's one expense you could redirect toward building your pipeline instead?",
  "The income documentation for a mortgage loan matters. What are you doing to strengthen it?",
  "Are you tracking your business income and expenses consistently? What would improve that?",
  "Owning your own home by the end of 2026 — how real does that feel right now? What would make it more real?",

  // Weekly prompts (used in rotation)
  "Looking at this week as a whole: where did you show up fully, and where did you coast?",
  "What's the biggest thing you learned about yourself or your business this week?",
  "Did this week's priorities match your actual calendar? If not, what needs to change?",
  "What client, conversation, or content piece from this week are you most proud of?",
  "If you could redo one decision from this week, what would it be and why?",

  // Monthly / big picture
  "How much closer to $10k/month are you compared to 30 days ago? What moved the needle?",
  "What's one thing that felt impossible 90 days ago that now feels within reach?",
  "Who in your life is rooting for you? Have you let them know your progress recently?",
  "What's the version of December 31, 2026 that would make you say this year was worth it?",
];

export function getDailyPrompt(date: string = new Date().toISOString().slice(0, 10)): string {
  // Use the day-of-year as a stable index so the same prompt shows all day
  const d = new Date(date + 'T12:00:00');
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return DAILY_PROMPTS[dayOfYear % DAILY_PROMPTS.length];
}

export function getWeeklyPrompt(date: string = new Date().toISOString().slice(0, 10)): string {
  const weekly = DAILY_PROMPTS.slice(33, 38); // weekly-focused prompts
  const d = new Date(date + 'T12:00:00');
  const weekNum = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
  return weekly[weekNum % weekly.length];
}

export function getMonthlyPrompt(date: string = new Date().toISOString().slice(0, 10)): string {
  const monthly = DAILY_PROMPTS.slice(38); // monthly-focused prompts
  const month = new Date(date + 'T12:00:00').getMonth();
  return monthly[month % monthly.length];
}
