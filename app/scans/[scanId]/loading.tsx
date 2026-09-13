export default function ScanLoading() {
  return (
    <div className="editorial-container py-16">
      <div className="h-3 w-28 bg-line" style={{ borderRadius: "var(--radius-inner)" }} />
      <div
        className="mt-4 h-10 w-2/3 max-w-md bg-line"
        style={{ borderRadius: "var(--radius-inner)" }}
      />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="surface-panel h-80" />
        <div className="surface-panel h-80" />
      </div>
    </div>
  );
}
