import Link from "next/link";

export default function ScanNotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">没有这次扫描</h1>
      <p className="mt-4 text-sm leading-7 text-muted">
        这个 scanId 不在{" "}
        <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
          data/index.json
        </code>{" "}
        里。
      </p>
      <Link href="/" className="mt-8 text-sm text-marrs hover:text-marrs-deep">
        返回扫描列表
      </Link>
    </main>
  );
}
