import { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  lastUpdated: string;
  onDismiss: () => void;
}

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function CheckInBanner({ lastUpdated, onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const needsCheckIn = lastUpdated !== getTodayISO();
  if (!needsCheckIn || dismissed) return null;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="bg-primary/10 border border-primary/30 rounded-[14px] px-5 py-3.5 mb-8 flex items-center gap-3">
      <span className="text-xl flex-shrink-0">📋</span>
      <div className="flex-1">
        <span className="text-[0.88rem] text-foreground font-medium">{greeting}, Liz. </span>
        <span className="text-[0.88rem] text-muted-foreground">
          You haven't logged today yet —{' '}
          <button
            onClick={onDismiss}
            className="underline underline-offset-2 text-primary hover:text-primary/80 transition-colors"
          >
            scroll up to your Command Center
          </button>{' '}
          to set your priorities.
        </span>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-muted-foreground/50 hover:text-muted-foreground flex-shrink-0 transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
