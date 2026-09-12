export default function ScanLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
      <div className="h-3 w-28 bg-line" />
      <div className="mt-4 h-10 w-2/3 max-w-md bg-line" />
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="h-80 bg-paper ring-1 ring-line" />
        <div className="h-80 bg-paper ring-1 ring-line" />
      </div>
    </div>
  );
}
