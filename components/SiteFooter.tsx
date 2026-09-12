import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>赛道扫描 · daily-news · 静态归档，不实时抓取。</p>
        <Link href="/about" className="hover:text-marrs">
          数据从哪来
        </Link>
      </div>
    </footer>
  );
}
