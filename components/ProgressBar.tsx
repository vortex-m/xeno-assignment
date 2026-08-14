import Panel from "@/components/ui/Panel";

interface ProgressBarProps {
  processed: number;
  total: number;
}

export default function ProgressBar({ processed, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((processed / total) * 100) : 0;
  return (
    <Panel title="Processing" className="mb-6">
      <div className="mb-2 text-sm">
        {processed < total
          ? `Validating row ${processed} of ${total}…`
          : "Finalizing…"}
      </div>
      <div className="h-1 overflow-hidden rounded-md bg-border">
        <div
          className="h-full rounded-md bg-accent-gradient transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </Panel>
  );
}
