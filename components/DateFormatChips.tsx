import { DateFormatDef } from "@/lib/types";

interface DateFormatChipsProps {
  formats: DateFormatDef[];
  activeIndices: Set<number>;
  onToggle: (index: number) => void;
}

/** Toggleable pill chips for which date formats count as valid. */
export default function DateFormatChips({
  formats,
  activeIndices,
  onToggle,
}: DateFormatChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {formats.map((f, i) => {
        const active = activeIndices.has(i);
        return (
          <button
            key={f.label}
            type="button"
            onClick={() => onToggle(i)}
            className={`select-none rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              active
                ? "border-accent bg-accent text-white"
                : "border-border bg-surface2 text-text hover:border-accent/60"
            }`}
          >
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
