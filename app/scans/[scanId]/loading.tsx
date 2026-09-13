export default function ScanLoading() {
  return (
    <div className="docs-container py-16">
      <div className="h-3 w-28 bg-line" />
      <div className="mt-4 h-8 w-2/3 max-w-md bg-line" />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="h-64 border-t border-line bg-paper/60" />
        <div className="h-64 border-l border-line bg-paper/40" />
      </div>
    </div>
  );
}
