export default function Header() {
  return (
    <header className="flex  items-center gap-3 border-b border-border bg-surface px-8 py-4">
      <div className="max-w-6xl mx-auto flex w-full items-center">
        <div className="text-xl font-extrabold tracking-tight">XENO</div>
        <div className="ml-auto text-[13px] text-muted">
          Transaction Data Validator
        </div>
      </div>
    </header>
  );
}
