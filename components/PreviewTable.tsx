import Panel from "@/components/ui/Panel";
import { RawRow, ValidationIssue } from "@/lib/types";

interface PreviewTableProps {
  headers: string[];
  rows: RawRow[];
  issues: ValidationIssue[];
}

const PREVIEW_LIMIT = 50;

/** Raw data preview with cells that have a validation issue highlighted. */
export default function PreviewTable({ headers, rows, issues }: PreviewTableProps) {
  const errCells = new Set(issues.map((i) => `${i.row}:${i.field}`));
  const preview = rows.slice(0, PREVIEW_LIMIT);

  return (
    <Panel title="Data Preview (highlighted issues)" className="mb-6">
      <div className="scrollbar-thin max-h-64 overflow-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="sticky top-0 whitespace-nowrap border-b border-border bg-surface2 px-3 py-2 text-left text-[10px] uppercase tracking-wide text-muted"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.map((row, ri) => {
              const rowNum = ri + 2;
              return (
                <tr key={rowNum}>
                  {headers.map((h) => {
                    const isErr = errCells.has(`${rowNum}:${h}`);
                    return (
                      <td
                        key={h}
                        className={`whitespace-nowrap border-b border-border px-3 py-1.5 ${
                          isErr ? "bg-err/10 text-err" : ""
                        }`}
                      >
                        {row[h] || ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
