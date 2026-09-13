import Link from "next/link";

export default function NotFound() {
  return (
    <main className="docs-container flex flex-1 flex-col justify-center py-24">
      <p className="text-[13px] font-medium tabular-nums text-marrs">404</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">页面不存在</h1>
      <Link href="/" className="interactive focus-ring mt-8 text-sm font-medium text-marrs hover:text-marrs-deep">
        返回首页
      </Link>
    </main>
  );
}
