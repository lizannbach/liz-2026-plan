interface ProgressBarProps {
  done: number;
  total: number;
  pct: number;
  global?: boolean;
}

export function ProgressBar({ done, total, pct, global = false }: ProgressBarProps) {
  return (
    <div className={`mb-3 ${global ? 'mt-5 px-4 py-3 bg-primary/[0.07] rounded-lg' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-muted-foreground italic">{done} of {total} complete</span>
        <span className="text-xs font-bold text-primary">{pct}%</span>
      </div>
      <div className={`prog-track ${global ? '!h-[7px]' : ''}`}>
        <div className="prog-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
