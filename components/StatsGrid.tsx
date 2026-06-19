import { ValidationSummary } from "@/lib/types";

interface StatCardProps {
  value: number;
  label: string;
  colorClass: string;
}

function StatCard({ value, label, colorClass }: StatCardProps) {
  return (
    <div className="rounded-[10px] border border-border bg-surface p-4 text-center">
      <div className={`mb-1 text-[28px] font-extrabold ${colorClass}`}>
        {value}
      </div>
      <div className="text-xs uppercase tracking-wide text-muted">
        {label}
      </div>
    </div>
  );
}

export default function StatsGrid({ summary }: { summary: ValidationSummary }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard value={summary.total} label="Total Rows" colorClass="text-accent" />
      <StatCard value={summary.ok} label="Valid" colorClass="text-ok" />
      <StatCard value={summary.errors} label="Errors" colorClass="text-err" />
      <StatCard value={summary.warnings} label="Warnings" colorClass="text-warn" />
    </div>
  );
}
