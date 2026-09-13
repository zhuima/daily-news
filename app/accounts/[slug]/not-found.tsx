import Link from "next/link";

export default function AccountNotFound() {
  return (
    <main className="editorial-container flex flex-1 flex-col justify-center py-24">
      <p className="text-[13px] font-medium tabular-nums text-marrs">404</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight">未找到该公众号</h1>
      <Link
        href="/accounts"
        className="interactive focus-ring mt-8 inline-block text-sm font-medium text-marrs"
      >
        返回追踪列表
      </Link>
    </main>
  );
}
