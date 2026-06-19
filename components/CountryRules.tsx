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
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
      {countries.map((c) => (
        <div
          key={c.code}
          className="
            group flex items-center gap-4
            rounded-md border border-border
            bg-surface p-4
          "
        >
          {/* Flag */}
          <div
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full bg-surface2
              text-2xl
            "
          >
            {c.flag}
          </div>

          {/* Country */}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-text">
              {c.name}
            </div>

            <div className="mt-0.5 text-xs font-medium text-muted">
              Code: <span className="font-mono text-accent">{c.code}</span>
            </div>
          </div>

          {/* Digits */}
          <div className="flex  items-center gap-1">
            <label className="text-[10px] uppercase tracking-wider text-muted">
              Digits
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={digitsByCode[c.code] ?? c.digits}
              onChange={(e) =>
                onDigitsChange(c.code, parseInt(e.target.value) || 0)
              }
              className="
                h-9 w-14
                rounded-lg border border-border
                bg-bg
                text-center
                font-mono text-sm font-semibold
                text-text

                outline-none
                transition

                focus:border-accent
                focus:ring-2
                focus:ring-accent/20
              "
            />
          </div>
        </div>
      ))}
    </div>
  );
}
