import type { Metadata } from "next";
import Link from "next/link";
import { ArticleScoreChip } from "@/components/ArticleScoreChip";
import { ScanCard } from "@/components/ScanCard";
import { HomeSearch } from "@/components/HomeSearch";
import { TopicRail } from "@/components/TopicRail";
import { JsonLd } from "@/components/JsonLd";
import { resolveArticleLink } from "@/lib/articles";
import { getAllArticles, getCatalog, getScans } from "@/lib/data";
import { formatScanDate } from "@/lib/format";
import {
  countByQuery,
  featuredLinkedArticle,
  scanSummary,
} from "@/lib/home-analytics";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

const faq = [
  {
    question: "赛道扫描是什么？",
    answer:
      "赛道扫描（Track Scan）把微信读书等来源的关键词扫描结果做成可浏览的静态归档，按日期与检索词组织文章。",
  },
  {
    question: "如何打开微信公众号原文？",
    answer:
      "仅当条目含已验证 mp.weixin.qq.com 或搜狗 link 跳转时显示「打开原文」，不使用搜索页代替。",
  },
  {
    question: "如何追踪公众号？",
    answer: "在 /accounts 在线增删追踪列表（Vercel KV + 管理口令）。",
  },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const scans = await getScans();
  const catalog = await getCatalog();
  const articles = await getAllArticles();
  const latestScan = scans[0];
  const featured = featuredLinkedArticle(articles);
  const featuredLink = featured ? resolveArticleLink(featured) : null;
  const topics = countByQuery(articles);
  const linkedTotal = articles.filter((a) => resolveArticleLink(a)).length;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${absoluteUrl("/")}#webpage`,
              url: absoluteUrl("/"),
              name: SITE_NAME,
              description: SITE_DESCRIPTION,
              isPartOf: { "@id": `${absoluteUrl("/")}#website` },
              inLanguage: "zh-CN",
            },
            {
              "@type": "FAQPage",
              "@id": `${absoluteUrl("/")}#faq`,
              mainEntity: faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ],
        }}
      />

      <div className="docs-container pt-10 pb-16 sm:pt-14 sm:pb-24">
        <header className="max-w-[40rem]">
          <h1
            id="home-hero-title"
            className="text-[2rem] font-semibold tracking-tight text-ink sm:text-[2.25rem]"
          >
            赛道扫描
          </h1>
          <p className="type-lead mt-4">
            把一次关键词扫描变成可引用的阅读档案：公众号、发布时间、摘要与可验证原文链接。
          </p>
          <p className="mt-4 text-[13px] tabular-nums text-muted">
            {scans.length} 个扫描批次
            <span className="mx-2 text-line">·</span>
            {catalog.articles.length} 篇文章
            <span className="mx-2 text-line">·</span>
            {linkedTotal} 条已验证直链
            <span className="mx-2 text-line">·</span>
            {topics.length} 个检索词
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {latestScan ? (
              <Link href={`/scans/${latestScan.id}`} className="btn-solid">
                打开最新扫描
              </Link>
            ) : null}
            <Link href="/accounts" className="btn-ghost">
              管理公众号
            </Link>
          </div>
        </header>

        <section
          id="site-search"
          className="mt-12 max-w-[40rem]"
          aria-labelledby="home-search-title"
        >
          <h2 id="home-search-title" className="text-lg font-semibold tracking-tight">
            全站检索
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            按标题、公众号、检索词或摘要搜索归档条目。
          </p>
          <div className="mt-4">
            <HomeSearch articles={articles} />
          </div>
        </section>

        {featured && featuredLink ? (
          <section
            className="mt-12 max-w-[40rem] border-t border-line pt-8"
            aria-labelledby="featured-title"
          >
            <p className="text-[13px] text-muted">推荐阅读</p>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
              <h2
                id="featured-title"
                className="text-[1.15rem] font-medium leading-snug tracking-tight"
              >
                <Link
                  href={`/scans/${featured.scanDate}?article=${encodeURIComponent(featured.id)}`}
                  className="focus-ring hover:text-marrs"
                >
                  {featured.title}
                </Link>
              </h2>
              <ArticleScoreChip article={featured} />
            </div>
            <p className="mt-2 text-[13px] text-muted">
              {featured.account}
              <span className="mx-2">·</span>
              <time dateTime={featured.scanDate}>{featured.publishedLabel}</time>
              <span className="mx-2">·</span>
              {featured.query}
            </p>
            <p className="mt-3 line-clamp-2 text-sm leading-7 text-muted">
              {featured.summary}
            </p>
            <p className="mt-3">
              <a
                href={featuredLink.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`打开原文：${featured.title}`}
                className="focus-ring text-sm font-medium text-marrs hover:underline"
              >
                查看原文 →
              </a>
            </p>
          </section>
        ) : null}

        <section id="scans" className="mt-14">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start">
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight">扫描批次</h2>
                {latestScan ? (
                  <p className="text-[13px] tabular-nums text-muted">
                    更新{" "}
                    <time dateTime={latestScan.date}>
                      {formatScanDate(latestScan.date)}
                    </time>
                  </p>
                ) : null}
              </div>
              <div className="mt-4 divide-y divide-line border-y border-line">
                {scans.map((scan, index) => (
                  <ScanCard
                    key={scan.id}
                    scan={scan}
                    featured={index === 0}
                    meta={scanSummary(scan, articles)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-8 lg:pt-1">
              <TopicRail topics={topics.slice(0, 8)} scanId={latestScan?.id} />
              <aside className="border-t border-line pt-5 text-sm leading-7 text-muted">
                <h2 className="text-sm font-medium text-ink">引用与 GEO</h2>
                <p className="mt-2 max-w-[36ch]">
                  机器可读入口：
                  <Link
                    href="/llms.txt"
                    className="focus-ring text-marrs hover:underline"
                  >
                    llms.txt
                  </Link>
                  、
                  <a
                    href="/feed.xml"
                    className="focus-ring text-marrs hover:underline"
                  >
                    RSS
                  </a>
                  、
                  <a
                    href="/sitemap.xml"
                    className="focus-ring text-marrs hover:underline"
                  >
                    sitemap
                  </a>
                  。
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="mt-16 border-t border-line pt-10"
          aria-labelledby="home-faq-title"
        >
          <h2
            id="home-faq-title"
            className="text-lg font-semibold tracking-tight"
          >
            常见问题
          </h2>
          <div className="mt-4 max-w-[65ch] divide-y divide-line">
            {faq.map((item) => (
              <details key={item.question} className="group py-4">
                <summary className="focus-ring cursor-pointer list-none text-[15px] font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm leading-7 text-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
