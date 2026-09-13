import Link from "next/link";

export default function ScanNotFound() {
  return (
    <main className="docs-container flex flex-1 flex-col justify-center py-24">
      <p className="text-[13px] font-medium tabular-nums text-marrs">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">没有这次扫描</h1>
      <p className="mt-4 max-w-[65ch] text-sm leading-7 text-muted">
        这个 scanId 不在{" "}
        <code className="meta-block px-1.5 py-0.5 text-ink">
          data/index.json
        </code>{" "}
        里。
      </p>
      <Link href="/" className="interactive focus-ring mt-8 text-sm font-medium text-marrs hover:text-marrs-deep">
        返回扫描列表
      </Link>
    </main>
  );
}
