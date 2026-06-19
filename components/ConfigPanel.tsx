import Panel from "@/components/ui/Panel";
import CountryRules from "@/components/CountryRules";
import DateFormatChips from "@/components/DateFormatChips";
import { COUNTRIES, DATE_FORMATS } from "@/lib/constants";

interface ConfigPanelProps {
  digitsByCode: Record<string, number>;
  onDigitsChange: (code: string, digits: number) => void;
  activeDateFormats: Set<number>;
  onToggleDateFormat: (index: number) => void;
  chunkSize: number;
  onChunkSizeChange: (size: number) => void;
}

export default function ConfigPanel({
  digitsByCode,
  onDigitsChange,
  activeDateFormats,
  onToggleDateFormat,
  chunkSize,
  onChunkSizeChange,
}: ConfigPanelProps) {
  return (
    <Panel title="Phone Validation Rules by Country" className="mb-6">
      <CountryRules
        countries={COUNTRIES}
        digitsByCode={digitsByCode}
        onDigitsChange={onDigitsChange}
      />

      <div className="mt-4">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Accepted Date Formats
          <span className="h-px flex-1 bg-border" />
        </div>
        <DateFormatChips
          formats={DATE_FORMATS}
          activeIndices={activeDateFormats}
          onToggle={onToggleDateFormat}
        />
      </div>

      <div className="mt-4">
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          Chunk Size (rows per file)
          <span className="h-px flex-1 bg-border" />
        </div>
        <input
          type="number"
          min={1}
          max={10000}
          value={chunkSize}
          onChange={(e) => onChunkSizeChange(parseInt(e.target.value) || 1)}
          className="w-36 rounded-md border border-border bg-surface2 px-3 py-2 font-mono text-sm text-text focus:border-accent focus:outline-none"
        />
      </div>
    </Panel>
  );
}
