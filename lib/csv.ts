import { ParsedCSV, RawRow } from "./types";

/** Splits a single delimited line, respecting double-quoted fields. */
function smartSplit(line: string, sep: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === sep && !inQuotes) {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

/** Parses raw CSV/TSV text into headers + row objects. */
export function parseCSV(text: string): ParsedCSV {
  const sep = text.includes("\t") ? "\t" : ",";
  const lines = text.trim().split("\n").filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = smartSplit(lines[0], sep).map((h) =>
    h.trim().replace(/^"|"$/g, "")
  );

  const rows: RawRow[] = lines.slice(1).map((line) => {
    const vals = smartSplit(line, sep);
    const row: RawRow = {};
    headers.forEach((h, i) => {
      row[h] = (vals[i] ?? "").trim().replace(/^"|"$/g, "");
    });
    return row;
  });

  return { headers, rows };
}

/** Serializes rows back to CSV text for a given column order. */
export function toCSV(rows: RawRow[], columns: string[]): string {
  const head = columns.join(",");
  const body = rows
    .map((row) =>
      columns
        .map((col) => `"${(row[col] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return `${head}\n${body}`;
}

/** Triggers a browser file download for the given text content. */
export function downloadFile(
  content: string,
  filename: string,
  mime = "text/csv"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
