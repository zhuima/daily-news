import type { Metadata } from "next";
import { AccountsManager } from "@/components/AccountsManager";
import { JsonLd } from "@/components/JsonLd";
import { isAllowedArticleUrl } from "@/lib/articles";
import { readAccountsDocument } from "@/lib/accounts-store";
import { getAllArticles, getScans } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { adminTokenConfigured } from "@/lib/accounts-auth";

export const metadata: Metadata = buildPageMetadata({
  title: "追踪公众号",
  description:
    "在线添加或移除追踪的微信公众号。查看每个账号下的扫描文章，并使用 x-fetcher 在本地下载已收录 mp 链接的正文。",
  path: "/accounts",
});

export const dynamic = "force-dynamic";

export default async function AccountsPage() {
  const doc = await readAccountsDocument();
  const articles = await getAllArticles();
  const scans = await getScans();
  const articleStats: Record<string, { total: number; linked: number }> = {};

  for (const article of articles) {
    const bucket = articleStats[article.account] ?? { total: 0, linked: 0 };
    bucket.total += 1;
    if (isAllowedArticleUrl(article.url)) bucket.linked += 1;
    articleStats[article.account] = bucket;
  }

  const { dbConfigured } = await import("@/lib/db/client");
  const persistence = await dbConfigured();

  return (
    <main className="editorial-container pt-12 pb-16 sm:pt-16 sm:pb-24">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "追踪公众号",
          url: absoluteUrl("/accounts"),
          numberOfItems: doc.accounts.length,
        }}
      />
      <header className="max-w-[65ch]">
        <h1 className="text-4xl font-medium tracking-tight text-ink">追踪公众号</h1>
        <p className="mt-5 text-[15px] leading-8 text-muted">
          在浏览器内添加或移除追踪列表（Cloudflare D1 持久化）。可导入 wechatDownload 导出的文章链接 CSV/JSON（仅收录链接，不批量抓正文）。正文下载请在本机使用{" "}
          <a
            href="https://github.com/zhuima/x-fetcher"
            className="interactive focus-ring text-marrs hover:text-marrs-deep"
            rel="noopener noreferrer"
            target="_blank"
          >
            x-fetcher
          </a>{" "}
          对单篇 mp URL 抓取。
        </p>
      </header>

      <div className="mt-10">
        <AccountsManager
          initialAccounts={doc.accounts}
          articleStats={articleStats}
          persistence={persistence}
          adminConfigured={adminTokenConfigured()}
          scanOptions={scans.map((s) => ({ id: s.id, title: s.title }))}
        />
      </div>
    </main>
  );
}
