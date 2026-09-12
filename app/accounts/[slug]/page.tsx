import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { resolveArticleLink } from "@/lib/articles";
import { getArticlesByAccountSlug, getTrackedAccount } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/accounts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const account = await getTrackedAccount(slug);
  if (!account) return { title: "未找到公众号" };
  return buildPageMetadata({
    title: `${account.name} · 公众号文章`,
    description: `赛道扫描中 ${account.name} 的归档文章列表与原文链接状态。`,
    path: `/accounts/${slug}`,
  });
}

export default async function AccountDetailPage({
  params,
}: PageProps<"/accounts/[slug]">) {
  const { slug } = await params;
  const account = await getTrackedAccount(slug);
  if (!account) notFound();

  const articles = await getArticlesByAccountSlug(slug);
  const pageUrl = absoluteUrl(`/accounts/${slug}`);

  return (
    <main className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `${account.name} 文章列表`,
          url: pageUrl,
          numberOfItems: articles.length,
        }}
      />
      <nav aria-label="面包屑" className="text-sm text-muted">
        <Link href="/accounts" className="hover:text-marrs">
          追踪公众号
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{account.name}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl tracking-tight text-ink">{account.name}</h1>
        <p className="mt-3 text-sm text-muted">
          {articles.length} 篇扫描条目 · 追踪始于{" "}
          <time dateTime={account.addedAt}>{account.addedAt}</time>
        </p>
        {account.notes ? (
          <p className="mt-3 text-sm leading-7 text-ink/80">{account.notes}</p>
        ) : null}
      </header>

      <section className="mt-8 rounded-sm border border-line bg-canvas p-5 text-sm leading-7">
        <h2 className="text-base text-ink">下载正文（本地操作）</h2>
        <p className="mt-2 text-muted">
          x-fetcher 仅支持<strong className="text-ink">单篇 mp URL</strong>
          。对已收录链接运行：
        </p>
        <pre className="mt-3 overflow-x-auto rounded-sm bg-paper p-4 text-xs ring-1 ring-line">
{`node scripts/download-account-bodies.mjs --account "${account.name}"`}
        </pre>
      </section>

      <section className="mt-10" aria-labelledby="account-articles-title">
        <h2 id="account-articles-title" className="text-xl tracking-tight">
          文章列表
        </h2>
        <ul className="mt-6 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
          {articles.map((article) => {
            const link = resolveArticleLink(article);
            return (
              <li key={article.id} className="px-5 py-4">
                <article>
                  <h3 className="text-[15px] leading-6 text-ink">
                    <Link
                      href={`/scans/${article.scanDate}?article=${encodeURIComponent(article.id)}`}
                      className="hover:text-marrs"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    <time dateTime={article.scanDate}>{article.publishedLabel}</time>
                    <span className="mx-2">·</span>
                    {article.query}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/75">
                    {article.summary}
                  </p>
                  <p className="mt-3">
                    {link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`打开原文：${article.title}`}
                        className="text-sm text-marrs hover:text-marrs-deep"
                      >
                        打开原文 →
                      </a>
                    ) : (
                      <span className="text-sm text-muted">原文链接待收录</span>
                    )}
                  </p>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
