import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-24 sm:px-8">
      <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl tracking-tight">页面不存在</h1>
      <Link href="/" className="mt-8 text-sm text-marrs hover:text-marrs-deep">
        返回首页
      </Link>
    </main>
  );
}
