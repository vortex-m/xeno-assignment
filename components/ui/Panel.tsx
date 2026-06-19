import { ReactNode } from "react";

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/** Bordered surface card used throughout the app, with an optional
 *  uppercase title that grows a hairline divider to fill the row. */
export default function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <div
      className={`rounded-md border border-border bg-surface p-6 ${className}`}
    >
      {title && (
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
          <span className="h-px flex-1 bg-border" />
        </div>
      )}
      {children}
    </div>
  );
}
