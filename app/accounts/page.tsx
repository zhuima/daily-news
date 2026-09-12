import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  getArticlesByAccountName,
  getTrackedAccounts,
} from "@/lib/data";
import { isAllowedArticleUrl } from "@/lib/articles";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "追踪公众号",
  description:
    "赛道扫描追踪的微信公众号列表。查看每个账号下的扫描文章，并使用 x-fetcher 在本地下载已收录 mp 链接的正文。",
  path: "/accounts",
});

export default function AccountsPage() {
  const accounts = getTrackedAccounts();

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "追踪公众号",
          url: absoluteUrl("/accounts"),
          numberOfItems: accounts.length,
        }}
      />
      <header className="max-w-3xl">
        <p className="text-xs tracking-[0.14em] text-marrs">Accounts</p>
        <h1 className="mt-2 text-4xl tracking-tight text-ink">追踪公众号</h1>
        <p className="mt-4 text-[15px] leading-8 text-muted">
          在{" "}
          <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
            data/accounts.json
          </code>{" "}
          维护追踪列表。点击账号查看当前目录中的文章；「下载全部」请在本地运行脚本，通过{" "}
          <a
            href="https://github.com/zhuima/x-fetcher"
            className="text-marrs hover:text-marrs-deep"
            rel="noopener noreferrer"
            target="_blank"
          >
            x-fetcher
          </a>{" "}
          逐篇抓取已验证 mp URL（不支持公众号历史全量）。
        </p>
      </header>

      <section className="mt-10" aria-labelledby="accounts-list-title">
        <h2 id="accounts-list-title" className="text-xl tracking-tight text-ink">
          已追踪（{accounts.length}）
        </h2>
        <ul className="mt-6 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
          {accounts.map((account) => {
            const items = getArticlesByAccountName(account.name);
            const linked = items.filter((a) => isAllowedArticleUrl(a.url)).length;
            return (
              <li key={account.slug}>
                <Link
                  href={`/accounts/${account.slug}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-canvas"
                >
                  <div>
                    <p className="text-lg text-ink">{account.name}</p>
                    <p className="mt-1 text-sm text-muted">
                      {items.length} 篇扫描条目 · {linked} 篇已收录 mp 链接
                    </p>
                  </div>
                  <span className="text-sm text-marrs">查看 →</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12 rounded-sm border border-line bg-canvas p-6 text-sm leading-7 text-muted">
        <h2 className="text-base text-ink">添加 / 移除公众号</h2>
        <p className="mt-2">
          编辑{" "}
          <code className="rounded-sm bg-paper px-1 py-0.5 ring-1 ring-line">
            data/accounts.json
          </code>
          ：增加 <code>slug</code>、<code>name</code>、<code>addedAt</code>{" "}
          字段后重新部署。slug 需唯一（中文名可用 base64url）。
        </p>
      </section>
    </main>
  );
}
