import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";
import { ColumnMap, ExpectedField } from "@/lib/types";
import { SKIP_VALUE } from "@/lib/constants";

interface ColumnMapperProps {
  fields: ExpectedField[];
  headers: string[];
  columnMap: ColumnMap;
  onMapChange: (fieldKey: string, header: string) => void;
  onValidate: () => void;
  validating: boolean;
}

/** Lets the user map each expected field to a column from the
 *  uploaded file (auto-guessed on upload, editable per-field). */
export default function ColumnMapper({
  fields,
  headers,
  columnMap,
  onMapChange,
  onValidate,
  validating,
}: ColumnMapperProps) {
  return (
    <Panel title="Map Your Columns" className="mb-6">
      <div className="mb-4 grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
        {fields.map((f) => (
          <div key={f.key}>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-accent">
              {f.label}
            </div>
            <div className="rounded-lg border border-border bg-surface2 px-3.5 py-2.5">
              <select
                value={columnMap[f.key] || SKIP_VALUE}
                onChange={(e) => onMapChange(f.key, e.target.value)}
                className="w-full cursor-pointer bg-transparent font-mono text-[13px] text-text outline-none"
              >
                <option value={SKIP_VALUE}>(skip)</option>
                {headers.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onValidate} disabled={validating}>
        Validate Data
      </Button>
    </Panel>
  );
}
