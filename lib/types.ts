export interface Country {
  code: string;
  name: string;
  flag: string;
  digits: number;
}

export interface DateFormatDef {
  label: string;
  re: RegExp;
}

export type FieldType = "id" | "text" | "number" | "date" | "phone";

export interface ExpectedField {
  key: string;
  label: string;
  type: FieldType;
}

/** A single parsed CSV row, keyed by original header name. */
export type RawRow = Record<string, string>;

/** Maps an expected field key -> chosen source column header (or "" / "(skip)"). */
export type ColumnMap = Record<string, string>;

export type Severity = "error" | "warning";

export interface ValidationIssue {
  row: number;
  field: string;
  value: string;
  msg: string;
  sev: Severity;
}

export interface ValidationResult {
  ok: boolean;
  msg?: string;
}

export interface ParsedCSV {
  headers: string[];
  rows: RawRow[];
}

export interface ValidationSummary {
  total: number;
  ok: number;
  errors: number;
  warnings: number;
}
