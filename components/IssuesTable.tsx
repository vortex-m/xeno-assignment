"use client";

import { useState } from "react";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";
import { Severity, ValidationIssue } from "@/lib/types";

type Filter = "all" | Severity;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "error", label: "Errors" },
  { key: "warning", label: "Warnings" },
];

export default function IssuesTable({ issues }: { issues: ValidationIssue[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const filtered = filter === "all" ? issues : issues.filter((i) => i.sev === filter);

  return (
    <Panel className="mb-6">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold">Validation Issues</div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filter === f.key
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-surface2 text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-8 text-center text-ok">✅ No issues found!</div>
        ) : (
          <table className="w-full border-collapse text-[13px]">
            <thead>
              <tr>
                {["Row", "Field", "Value", "Rule", "Severity"].map((h) => (
                  <th
                    key={h}
                    className="border-b border-border bg-surface2 px-3.5 py-2.5 text-left text-[11px] uppercase tracking-wide text-muted"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((iss, idx) => (
                <tr key={idx} className="hover:bg-surface2">
                  <td className="border-b border-border px-3.5 py-2.5 font-mono text-muted">
                    #{iss.row}
                  </td>
                  <td className="border-b border-border px-3.5 py-2.5 font-mono text-accent">
                    {iss.field}
                  </td>
                  <td className="border-b border-border px-3.5 py-2.5 font-mono">
                    {iss.value || <em className="text-muted">empty</em>}
                  </td>
                  <td className="border-b border-border px-3.5 py-2.5">{iss.msg}</td>
                  <td className="border-b border-border px-3.5 py-2.5">
                    <Badge severity={iss.sev} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Panel>
  );
}
