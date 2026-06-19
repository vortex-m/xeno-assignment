export default function Header() {
  return (
    <header className="flex items-center gap-3 border-b border-border bg-surface px-8 py-4">
      <div className="text-xl font-extrabold tracking-tight">
        Data<span className="text-gradient">Guard</span>
      </div>
      <div className="ml-auto text-[13px] text-muted">
        Transaction Data Validator
      </div>
    </header>
  );
}
