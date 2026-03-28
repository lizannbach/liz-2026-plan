import { TableRow } from '@/lib/plan-types';

interface Props {
  header: string;
  sub?: string;
  columns: string[];
  rows: TableRow[];
  note?: string;
}

export function DataTable({ header, sub, columns, rows, note }: Props) {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5 sm:p-7 mb-9">
      <h3 className="text-[0.9rem] text-foreground/80 mb-1.5 font-body font-normal">{header}</h3>
      {sub && <p className="text-[0.82rem] text-muted-foreground italic mb-4">{sub}</p>}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[0.87rem]">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="text-left text-[0.72rem] uppercase tracking-wide text-muted-foreground font-normal bg-background p-2 border-b border-border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`${row.highlight ? 'bg-[hsl(72,22%,91%)] font-bold text-[hsl(70,26%,29%)]' : row.warning ? 'bg-[hsl(40,18%,94%)] text-foreground' : row.total ? 'bg-[hsl(72,22%,91%)] font-bold text-[hsl(70,26%,29%)]' : ''}`}>
                {row.cells.map((cell, j) => (
                  <td key={j} className="p-2 border-b border-border/50 text-left" colSpan={cell === '' && j > 0 ? undefined : undefined}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <p className="mt-3.5 text-[0.83rem] text-muted-foreground italic leading-relaxed">{note}</p>}
    </div>
  );
}
