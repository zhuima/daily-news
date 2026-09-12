import type { Metadata } from "next";
import Link from "next/link";
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

export default function HomePage() {
  const scans = getScans();
  const catalog = getCatalog();
  const articles = getAllArticles();
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

      <section
        className="border-b border-line bg-marrs text-white"
        aria-labelledby="home-hero-title"
      >
        <div className="editorial-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="font-display text-xs tracking-[0.28em] text-white/70 uppercase">
              Track Scan · daily-news
            </p>
            <h1
              id="home-hero-title"
              className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl"
            >
              赛道扫描
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/88">
              把一次关键词扫描变成可引用的阅读档案：公众号、发布时间、摘要与可验证原文链接，深链分享不断档。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {latestScan ? (
                <Link
                  href={`/scans/${latestScan.id}`}
                  className="inline-flex h-11 items-center bg-white px-5 text-sm font-medium text-marrs transition hover:bg-white/90"
                >
                  打开最新扫描
                </Link>
              ) : null}
              <Link
                href="/accounts"
                className="inline-flex h-11 items-center border border-white/50 px-5 text-sm text-white transition hover:bg-white/10"
              >
                管理公众号
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {[
              { label: "扫描批次", value: scans.length },
              { label: "文章条目", value: catalog.articles.length },
              { label: "已验证直链", value: linkedTotal },
              { label: "检索词", value: topics.length },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/25 bg-white/5 px-4 py-5 backdrop-blur-sm"
              >
                <p className="text-xs text-white/65">{stat.label}</p>
                <p className="mt-2 text-3xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {featured && featuredLink ? (
        <section className="editorial-container py-10 sm:py-12" aria-labelledby="featured-title">
          <div className="grid gap-6 border border-marrs/20 bg-paper p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
            <div>
              <p className="text-xs tracking-[0.14em] text-marrs">已收录直链 · 推荐阅读</p>
              <h2 id="featured-title" className="mt-2 text-2xl leading-snug tracking-tight">
                <Link
                  href={`/scans/${featured.scanDate}?article=${encodeURIComponent(featured.id)}`}
                  className="hover:text-marrs"
                >
                  {featured.title}
                </Link>
              </h2>
              <p className="mt-3 text-sm text-muted">
                {featured.account}
                <span className="mx-2">·</span>
                <time dateTime={featured.scanDate}>{featured.publishedLabel}</time>
                <span className="mx-2">·</span>
                {featured.query}
              </p>
              <p className="mt-3 line-clamp-2 text-sm leading-7 text-ink/80">
                {featured.summary}
              </p>
            </div>
            <a
              href={featuredLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`打开原文：${featured.title}`}
              className="inline-flex h-11 shrink-0 items-center justify-center bg-marrs px-5 text-sm text-white hover:bg-marrs-deep"
            >
              打开原文
            </a>
          </div>
        </section>
      ) : null}

      <section
        id="site-search"
        className="editorial-container py-10 sm:py-12"
        aria-labelledby="home-search-title"
      >
        <div className="mb-6 max-w-2xl">
          <h2 id="home-search-title" className="text-2xl tracking-tight">
            全站检索
          </h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            按标题、公众号、检索词或摘要搜索归档条目，进入扫描工作台深链阅读。
          </p>
        </div>
        <HomeSearch articles={articles} />
      </section>

      <section id="scans" className="editorial-container pb-16 sm:pb-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.14em] text-marrs">Archive</p>
                <h2 className="mt-2 text-3xl tracking-tight">扫描批次</h2>
              </div>
              {latestScan ? (
                <p className="text-sm text-muted">
                  更新{" "}
                  <time dateTime={latestScan.date}>
                    {formatScanDate(latestScan.date)}
                  </time>
                </p>
              ) : null}
            </div>
            <div className="mt-8 space-y-5">
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
          <div className="space-y-5">
            <TopicRail topics={topics.slice(0, 8)} scanId={latestScan?.id} />
            <aside className="rounded-sm border border-line bg-canvas p-5 text-sm leading-7 text-muted">
              <h2 className="text-sm font-medium text-ink">引用与 GEO</h2>
              <p className="mt-2">
                机器可读入口：
                <Link href="/llms.txt" className="text-marrs hover:underline">
                  llms.txt
                </Link>
                、
                <a href="/feed.xml" className="text-marrs hover:underline">
                  RSS
                </a>
                、
                <a href="/sitemap.xml" className="text-marrs hover:underline">
                  sitemap
                </a>
                。
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="editorial-container border-t border-line pb-16 pt-10"
        aria-labelledby="home-faq-title"
      >
        <h2 id="home-faq-title" className="text-xl tracking-tight">
          常见问题
        </h2>
        <div className="mt-5 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
          {faq.map((item) => (
            <details key={item.question} className="group px-5 py-4">
              <summary className="cursor-pointer list-none text-base font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 pb-2 text-sm leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
