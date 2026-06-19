"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";

interface UploadZoneProps {
  fileName: string | null;
  fileError?: string | null;
  rowCount: number;
  columnCount: number;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

const ACCEPTED_EXTENSIONS = ".csv,.tsv,.txt,.xlsx,.xls,.xlsm";

/** Drag-and-drop / click-to-browse zone for the source dataset.
 *  Accepts CSV/TSV/TXT (parsed as text) and Excel workbooks
 *  (.xlsx/.xls/.xlsm, parsed via SheetJS — first sheet is used). */
export default function UploadZone({
  fileName,
  fileError,
  rowCount,
  columnCount,
  onFileSelected,
  onClear,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelected(file);
    // allow re-selecting the same file after an error/clear
    e.target.value = "";
  };

  return (
    <Panel title="Upload Dataset">
      {!fileName ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative cursor-pointer rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors ${
            dragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            onChange={handleChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="mb-3 text-4xl">📂</div>
          <div className="mb-1.5 text-base font-semibold">
            Drop your file here or click to browse
          </div>
          <div className="text-[13px] text-muted">
            Supports CSV, TSV, and Excel (.xlsx, .xls) with order, product,
            and payment fields
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-lg bg-surface2 p-3 text-[13px]">
          <span className="text-xl">
            {fileName.match(/\.xls(x|m)?$/i) ? "" : "📄"}
          </span>
          <span className="font-semibold">{fileName}</span>
          <span className="text-muted">
            {rowCount} rows · {columnCount} columns
          </span>
          <Button
            variant="outline"
            onClick={onClear}
            className="ml-auto px-3.5 py-1.5 text-xs"
          >
            ✕ Clear
          </Button>
        </div>
      )}

      {fileError && (
        <div className="mt-3 rounded-lg border border-err/30 bg-err/10 px-3.5 py-2.5 text-[13px] text-err">
          {fileError}
        </div>
      )}
    </Panel>
  );
}