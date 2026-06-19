import Panel from "@/components/ui/Panel";
import Button from "@/components/ui/Button";

interface ChunksPanelProps {
  chunkCount: number;
  chunkSize: number;
  cleanRowCount: number;
  onDownloadClean: () => void;
  onDownloadReport: () => void;
  onDownloadChunks: () => void;
}

export default function ChunksPanel({
  chunkCount,
  chunkSize,
  cleanRowCount,
  onDownloadClean,
  onDownloadReport,
  onDownloadChunks,
}: ChunksPanelProps) {
  const chunks = Array.from({ length: chunkCount }, (_, i) => {
    const rowsInChunk = Math.min(chunkSize, cleanRowCount - i * chunkSize);
    return { name: `chunk_${String(i + 1).padStart(2, "0")}.csv`, rows: rowsInChunk };
  });

  return (
    <Panel title="Downloads">
      <div className="mb-4 flex flex-wrap gap-3">
        <Button variant="ok" onClick={onDownloadClean}>
          ⬇ Download Cleaned CSV
        </Button>
        <Button variant="outline" onClick={onDownloadReport}>
          📋 Download Error Report
        </Button>
        <Button variant="outline" onClick={onDownloadChunks}>
          🗂 Download Chunks (ZIP-like)
        </Button>
      </div>

      <div className="mb-4 mt-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
        Chunks Preview
        <span className="h-px flex-1 bg-border" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {chunks.length === 0 ? (
          <span className="text-[13px] text-muted">No clean rows to chunk.</span>
        ) : (
          chunks.map((c) => (
            <div
              key={c.name}
              className="flex flex-col gap-1 rounded-lg border border-border bg-surface2 px-4 py-3 font-mono text-xs"
            >
              <span className="font-semibold text-accent">{c.name}</span>
              <span className="text-muted">{c.rows} rows</span>
            </div>
          ))
        )}
      </div>
    </Panel>
  );
}
