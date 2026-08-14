"use client";

import Header from "@/components/Header";
import ConfigPanel from "@/components/ConfigPanel";
import UploadZone from "@/components/UploadZone";
import ColumnMapper from "@/components/ColumnMapper";
import ProgressBar from "@/components/ProgressBar";
import StatsGrid from "@/components/StatsGrid";
import PreviewTable from "@/components/PreviewTable";
import IssuesTable from "@/components/IssuesTable";
import ChunksPanel from "@/components/ChunksPanel";
import { EXPECTED_FIELDS } from "@/lib/constants";
import { useTransactionValidator } from "@/hooks/useTransactionValidator";

export default function Home() {
  const v = useTransactionValidator();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1100px] px-6 py-8">
        <ConfigPanel
          digitsByCode={v.digitsByCode}
          onDigitsChange={v.handleDigitsChange}
          activeDateFormats={v.activeDateFormats}
          onToggleDateFormat={v.handleToggleDateFormat}
          chunkSize={v.chunkSize}
          onChunkSizeChange={v.setChunkSize}
        />

        <div className="mb-6">
          <UploadZone
            fileName={v.fileName}
            fileError={v.fileError}
            rowCount={v.rawRows.length}
            columnCount={v.headers.length}
            onFileSelected={v.handleFileSelected}
            onClear={v.handleClear}
          />
        </div>

        {v.fileName && (
          <ColumnMapper
            fields={EXPECTED_FIELDS}
            headers={v.headers}
            columnMap={v.columnMap}
            onMapChange={v.handleColumnMapChange}
            onValidate={v.runValidation}
            validating={v.validating}
          />
        )}

        {v.validating && (
          <ProgressBar processed={v.processed} total={v.rawRows.length} />
        )}

        {v.showResults && (
          <>
            <StatsGrid summary={v.summary} />
            <PreviewTable
              headers={v.headers}
              rows={v.rawRows}
              issues={v.issues}
            />
            <IssuesTable issues={v.issues} />
            <ChunksPanel
              chunkCount={v.chunkCount}
              chunkSize={v.chunkSize}
              cleanRowCount={v.cleanRows.length}
              onDownloadClean={v.downloadClean}
              onDownloadReport={v.downloadReport}
              onDownloadChunks={v.downloadChunks}
            />
          </>
        )}
      </main>
    </>
  );
}
