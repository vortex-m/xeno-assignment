import * as XLSX from "xlsx";
import { ParsedCSV, RawRow } from "./types";
import { parseCSV } from "./csv";

const EXCEL_EXTENSIONS = [".xlsx", ".xls", ".xlsm"];
const TEXT_EXTENSIONS = [".csv", ".tsv", ".txt"];

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot === -1 ? "" : filename.slice(dot).toLowerCase();
}

export function isSupportedFile(filename: string): boolean {
  const ext = getExtension(filename);
  return EXCEL_EXTENSIONS.includes(ext) || TEXT_EXTENSIONS.includes(ext);
}

/** Reads the first sheet of a workbook into the same {headers, rows} shape
 *  parseCSV produces, so the rest of the app doesn't need to know the
 *  original file type. */
function parseExcel(buffer: ArrayBuffer): ParsedCSV {
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) return { headers: [], rows: [] };

  const sheet = workbook.Sheets[sheetName];
  // header: 1 -> array-of-arrays, raw: false -> formatted strings (dates,
  // numbers, etc. come through as display text, matching CSV behavior).
  const grid: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  if (grid.length === 0) return { headers: [], rows: [] };

  const headers = (grid[0] as unknown[]).map((h) => String(h ?? "").trim());

  const rows: RawRow[] = grid
    .slice(1)
    .filter((line) => line.some((cell) => String(cell ?? "").trim() !== ""))
    .map((line) => {
      const row: RawRow = {};
      headers.forEach((h, i) => {
        row[h] = String(line[i] ?? "").trim();
      });
      return row;
    });

  return { headers, rows };
}

/** Reads a File (CSV/TSV/TXT/XLSX/XLS) into a unified {headers, rows} shape. */
export function parseFile(file: File): Promise<ParsedCSV> {
  const ext = getExtension(file.name);

  if (EXCEL_EXTENSIONS.includes(ext)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          resolve(parseExcel(buffer));
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  // Default to text/CSV/TSV parsing.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = String(e.target?.result ?? "");
        resolve(parseCSV(text));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}