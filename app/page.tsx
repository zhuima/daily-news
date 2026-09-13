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

      <section
        className="border-b border-line bg-marrs text-white"
        aria-labelledby="home-hero-title"
      >
        <div className="editorial-container grid gap-12 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="type-kicker text-white/80">
              关键词扫描归档
            </p>
            <h1
              id="home-hero-title"
              className="type-display mt-5 max-w-2xl text-4xl sm:text-5xl lg:text-[3.5rem]"
            >
              赛道扫描
            </h1>
            <p className="type-prose mt-6 text-lg leading-8 text-white/88">
              把一次关键词扫描变成可引用的阅读档案：公众号、发布时间、摘要与可验证原文链接，深链分享不断档。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              {latestScan ? (
                <Link href={`/scans/${latestScan.id}`} className="btn-on-marrs">
                  打开最新扫描
                </Link>
              ) : null}
              <Link href="/accounts" className="btn-ghost">
                管理公众号
              </Link>
            </div>
          </div>
          <dl className="grid grid-cols-2 overflow-hidden border border-white/20 bg-white/[0.06]">
            {[
              { label: "扫描批次", value: scans.length },
              { label: "文章条目", value: catalog.articles.length },
              { label: "已验证直链", value: linkedTotal },
              { label: "检索词", value: topics.length },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`px-5 py-6 ${index % 2 === 0 ? "border-r border-white/20" : ""} ${index < 2 ? "border-b border-white/20" : ""}`}
              >
                <dt className="text-[13px] font-medium text-white/68">{stat.label}</dt>
                <dd className="mt-2 text-3xl font-medium tabular-nums tracking-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {featured && featuredLink ? (
        <section className="editorial-container pt-12 pb-4 sm:pt-16" aria-labelledby="featured-title">
          <div className="grid gap-7 border-l-[3px] border-marrs bg-paper py-7 pr-6 pl-6 shadow-[var(--shadow-ink)] sm:grid-cols-[1fr_auto] sm:items-end sm:py-9 sm:pr-9 sm:pl-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] font-medium text-marrs">推荐阅读</p>
                <ArticleScoreChip article={featured} />
              </div>
              <h2 id="featured-title" className="mt-3 text-2xl font-medium leading-snug tracking-tight sm:text-[1.75rem]">
                <Link
                  href={`/scans/${featured.scanDate}?article=${encodeURIComponent(featured.id)}`}
                  className="interactive focus-ring hover:text-marrs"
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
              <p className="type-prose mt-4 line-clamp-2 text-sm leading-7 text-ink/80">
                {featured.summary}
              </p>
            </div>
            <a
              href={featuredLink.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`打开原文：${featured.title}`}
              className="btn-solid shrink-0"
            >
              打开原文
            </a>
          </div>
        </section>
      ) : null}

      <section
        id="site-search"
        className="editorial-container pt-10 pb-6 sm:pt-14"
        aria-labelledby="home-search-title"
      >
        <div className="mb-7 max-w-[65ch]">
          <h2 id="home-search-title" className="text-2xl font-medium tracking-tight">
            全站检索
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            按标题、公众号、检索词或摘要搜索归档条目，进入扫描工作台深链阅读。
          </p>
        </div>
        <HomeSearch articles={articles} />
      </section>

      <section id="scans" className="editorial-container pt-8 pb-20 sm:pt-10 sm:pb-28">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17.5rem] lg:items-start">
          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-3xl font-medium tracking-tight">扫描批次</h2>
              {latestScan ? (
                <p className="text-sm tabular-nums text-muted">
                  更新{" "}
                  <time dateTime={latestScan.date}>
                    {formatScanDate(latestScan.date)}
                  </time>
                </p>
              ) : null}
            </div>
            <div className="mt-8">
              {scans[0] ? (
                <ScanCard
                  scan={scans[0]}
                  featured
                  meta={scanSummary(scans[0], articles)}
                />
              ) : null}
              <div className="mt-2 divide-y divide-line">
                {scans.slice(1).map((scan) => (
                  <ScanCard
                    key={scan.id}
                    scan={scan}
                    meta={scanSummary(scan, articles)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-8 lg:pt-2">
            <TopicRail topics={topics.slice(0, 8)} scanId={latestScan?.id} />
            <aside className="border-t border-line pt-5 text-sm leading-7 text-muted">
              <h2 className="text-sm font-medium text-ink">引用与 GEO</h2>
              <p className="mt-2 max-w-[36ch]">
                机器可读入口：
                <Link href="/llms.txt" className="interactive focus-ring text-marrs hover:underline">
                  llms.txt
                </Link>
                、
                <a href="/feed.xml" className="interactive focus-ring text-marrs hover:underline">
                  RSS
                </a>
                、
                <a href="/sitemap.xml" className="interactive focus-ring text-marrs hover:underline">
                  sitemap
                </a>
                。
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="editorial-container border-t border-line pt-12 pb-20 sm:pt-14 sm:pb-24"
        aria-labelledby="home-faq-title"
      >
        <h2 id="home-faq-title" className="text-xl font-medium tracking-tight">
          常见问题
        </h2>
        <div className="mt-6 max-w-[65ch] divide-y divide-line">
          {faq.map((item) => (
            <details key={item.question} className="group py-5">
              <summary className="interactive focus-ring cursor-pointer list-none text-base font-medium text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 max-w-[65ch] text-sm leading-7 text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
