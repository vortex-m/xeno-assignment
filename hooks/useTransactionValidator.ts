"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { toCSV, downloadFile } from "@/lib/csv";
import { parseFile } from "@/lib/fileParser";
import {
  validateAmount,
  validateDate,
  validateId,
  validatePhone,
  validateRequiredText,
} from "@/lib/validators";
import {
  COUNTRIES,
  DATE_FORMATS,
  DEFAULT_ACTIVE_DATE_FORMATS,
  DEFAULT_CHUNK_SIZE,
  EXPECTED_FIELDS,
  SKIP_VALUE,
  VALIDATION_BATCH_SIZE,
} from "@/lib/constants";
import { ColumnMap, RawRow, ValidationIssue, ValidationSummary } from "@/lib/types";

const TEXT_ONLY_FIELDS = ["product_name", "payment_mode", "customer_name"];

function guessColumn(fieldKey: string, fieldLabel: string, headers: string[]): string {
  const normalizedKey = fieldKey.replace(/_/g, "").toLowerCase();
  const byKey = headers.find((h) =>
    h.toLowerCase().replace(/[^a-z]/g, "").includes(normalizedKey)
  );
  if (byKey) return byKey;
  const byLabel = headers.find((h) => fieldLabel.toLowerCase().includes(h.toLowerCase()));
  return byLabel || SKIP_VALUE;
}

export function useTransactionValidator() {
  // ── Source file state ──────────────────────────────────────────────
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [columnMap, setColumnMap] = useState<ColumnMap>({});

  // ── Config state ───────────────────────────────────────────────────
  const [digitsByCode, setDigitsByCode] = useState<Record<string, number>>(
    () => Object.fromEntries(COUNTRIES.map((c) => [c.code, c.digits]))
  );
  const [activeDateFormats, setActiveDateFormats] = useState<Set<number>>(
    () => new Set(DEFAULT_ACTIVE_DATE_FORMATS)
  );
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE);

  // ── Validation run state ───────────────────────────────────────────
  const [validating, setValidating] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [cleanRows, setCleanRows] = useState<RawRow[]>([]);
  const [showResults, setShowResults] = useState(false);
  const cancelRef = useRef(false);

  // ── File handling ──────────────────────────────────────────────────
  const [fileError, setFileError] = useState<string | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    setFileError(null);
    parseFile(file)
      .then(({ headers: parsedHeaders, rows }) => {
        if (parsedHeaders.length === 0) {
          setFileError("Couldn't find any columns in that file.");
          return;
        }

        const guesses: ColumnMap = {};
        EXPECTED_FIELDS.forEach((f) => {
          guesses[f.key] = guessColumn(f.key, f.label, parsedHeaders);
        });

        setHeaders(parsedHeaders);
        setRawRows(rows);
        setColumnMap(guesses);
        setFileName(file.name);
        setShowResults(false);
        setIssues([]);
        setCleanRows([]);
      })
      .catch(() => {
        setFileError(
          "Couldn't read that file. Make sure it's a valid CSV, TSV, or Excel (.xlsx/.xls) file."
        );
      });
  }, []);

  const handleClear = useCallback(() => {
    setFileName(null);
    setHeaders([]);
    setRawRows([]);
    setColumnMap({});
    setShowResults(false);
    setIssues([]);
    setCleanRows([]);
    setFileError(null);
  }, []);

  // ── Config handlers ────────────────────────────────────────────────
  const handleDigitsChange = useCallback((code: string, digits: number) => {
    setDigitsByCode((prev) => ({ ...prev, [code]: digits }));
  }, []);

  const handleToggleDateFormat = useCallback((index: number) => {
    setActiveDateFormats((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }, []);

  const handleColumnMapChange = useCallback((fieldKey: string, header: string) => {
    setColumnMap((prev) => ({ ...prev, [fieldKey]: header }));
  }, []);

  // ── Validation ─────────────────────────────────────────────────────
  const runValidation = useCallback(() => {
    cancelRef.current = false;
    setValidating(true);
    setShowResults(false);
    setProcessed(0);

    const total = rawRows.length;
    const collectedIssues: ValidationIssue[] = [];
    const collectedClean: RawRow[] = [];
    const activeFormats = DATE_FORMATS.filter((_, i) => activeDateFormats.has(i));

    let cursor = 0;

    const processBatch = () => {
      if (cancelRef.current) return;
      const end = Math.min(cursor + VALIDATION_BATCH_SIZE, total);

      for (let i = cursor; i < end; i++) {
        const row = rawRows[i];
        const rowNum = i + 2;
        let rowHasError = false;

        const countryCol = columnMap["country_code"];
        const countryCode =
          countryCol && countryCol !== SKIP_VALUE ? row[countryCol] : "IN";
        const expectedDigits = digitsByCode[countryCode] ?? digitsByCode["IN"] ?? 10;

        const check = (
          fieldKey: string,
          validator: (val: string | undefined) => { ok: boolean; msg?: string }
        ) => {
          const col = columnMap[fieldKey];
          if (!col || col === SKIP_VALUE) return;
          const val = row[col];
          const res = validator(val);
          if (!res.ok) {
            collectedIssues.push({
              row: rowNum,
              field: col,
              value: val || "",
              msg: res.msg || "Invalid value",
              sev: "error",
            });
            rowHasError = true;
          }
        };

        check("order_id", validateId);
        check("amount", validateAmount);
        check("order_date", (v) => validateDate(v, activeFormats));
        check("phone", (v) => validatePhone(v, countryCode, expectedDigits));

        TEXT_ONLY_FIELDS.forEach((key) => {
          const col = columnMap[key];
          if (col && col !== SKIP_VALUE) {
            const res = validateRequiredText(row[col], key.replace("_", " "));
            if (!res.ok) {
              collectedIssues.push({
                row: rowNum,
                field: col,
                value: "",
                msg: res.msg || "",
                sev: "warning",
              });
            }
          }
        });

        if (!rowHasError) collectedClean.push(row);
      }

      cursor = end;
      setProcessed(cursor);

      if (cursor < total) {
        requestAnimationFrame(processBatch);
      } else {
        setIssues(collectedIssues);
        setCleanRows(collectedClean);
        setValidating(false);
        setShowResults(true);
      }
    };

    if (total === 0) {
      setValidating(false);
      setShowResults(true);
      return;
    }

    requestAnimationFrame(processBatch);
  }, [rawRows, columnMap, digitsByCode, activeDateFormats]);

  // ── Derived data ───────────────────────────────────────────────────
  const summary: ValidationSummary = useMemo(
    () => ({
      total: rawRows.length,
      ok: cleanRows.length,
      errors: issues.filter((i) => i.sev === "error").length,
      warnings: issues.filter((i) => i.sev === "warning").length,
    }),
    [rawRows.length, cleanRows.length, issues]
  );

  const chunkCount = chunkSize > 0 ? Math.ceil(cleanRows.length / chunkSize) : 0;

  // ── Downloads ──────────────────────────────────────────────────────
  const downloadClean = useCallback(() => {
    downloadFile(toCSV(cleanRows, headers), "cleaned_data.csv");
  }, [cleanRows, headers]);

  const downloadReport = useCallback(() => {
    const lines = [
      "row,field,value,message,severity",
      ...issues.map(
        (i) => `${i.row},"${i.field}","${i.value}","${i.msg}",${i.sev}`
      ),
    ].join("\n");
    downloadFile(lines, "validation_report.csv");
  }, [issues]);

  const downloadChunks = useCallback(() => {
    for (let i = 0; i < cleanRows.length; i += chunkSize) {
      const chunk = cleanRows.slice(i, i + chunkSize);
      const idx = String(Math.floor(i / chunkSize) + 1).padStart(2, "0");
      setTimeout(
        () => downloadFile(toCSV(chunk, headers), `chunk_${idx}.csv`),
        (i / chunkSize) * 300
      );
    }
  }, [cleanRows, headers, chunkSize]);

  return {
    // file
    fileName,
    fileError,
    headers,
    rawRows,
    columnMap,
    handleFileSelected,
    handleClear,
    handleColumnMapChange,
    // config
    digitsByCode,
    handleDigitsChange,
    activeDateFormats,
    handleToggleDateFormat,
    chunkSize,
    setChunkSize,
    // validation run
    validating,
    processed,
    runValidation,
    showResults,
    issues,
    cleanRows,
    summary,
    chunkCount,
    // downloads
    downloadClean,
    downloadReport,
    downloadChunks,
  };
}