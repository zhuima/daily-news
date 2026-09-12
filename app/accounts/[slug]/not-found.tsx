import Link from "next/link";

export default function AccountNotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-24 sm:px-8">
      <h1 className="text-3xl tracking-tight">未找到该公众号</h1>
      <Link href="/accounts" className="mt-8 inline-block text-marrs">
        返回追踪列表
      </Link>
    </main>
  );
}
