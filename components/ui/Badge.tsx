import { Severity } from "@/lib/types";

const SEVERITY_CLASSES: Record<Severity, string> = {
  error: "bg-err/15 text-err",
  warning: "bg-warn/15 text-warn",
};

export default function Badge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${SEVERITY_CLASSES[severity]}`}
    >
      {severity}
    </span>
  );
}
