import { Country } from "@/lib/types";

interface CountryRulesProps {
  countries: Country[];
  digitsByCode: Record<string, number>;
  onDigitsChange: (code: string, digits: number) => void;
}

/** Editable grid of expected phone-digit counts, one card per country. */
export default function CountryRules({
  countries,
  digitsByCode,
  onDigitsChange,
}: CountryRulesProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3">
      {countries.map((c) => (
        <div
          key={c.code}
          className="flex items-center gap-2.5 rounded-lg border border-border bg-surface2 p-3"
        >
          <span className="text-xl">{c.flag}</span>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">
              {c.name} ({c.code})
            </div>
            <div className="font-mono text-[11px] text-muted">
              digits:{" "}
              <input
                type="number"
                min={1}
                max={15}
                value={digitsByCode[c.code] ?? c.digits}
                onChange={(e) =>
                  onDigitsChange(c.code, parseInt(e.target.value) || 0)
                }
                className="w-12 rounded border border-border bg-bg px-1.5 py-0.5 text-center font-mono text-[13px] text-text focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
