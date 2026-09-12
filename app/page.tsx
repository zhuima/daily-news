import type { Metadata } from "next";
import { ScanCard } from "@/components/ScanCard";
import { HomeSearch } from "@/components/HomeSearch";
import { JsonLd } from "@/components/JsonLd";
import { isAllowedArticleUrl } from "@/lib/articles";
import { getAllArticles, getCatalog, getScans } from "@/lib/data";
import { formatScanDate } from "@/lib/format";
import { buildPageMetadata } from "@/lib/seo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  path: "/",
});

const faq = [
  {
    question: "赛道扫描是什么？",
    answer:
      "赛道扫描（Track Scan）把微信读书等来源的关键词扫描结果做成可浏览的静态归档，按日期组织文章列表。",
  },
  {
    question: "如何打开某篇文章的微信公众号原文？",
    answer:
      "当 data/index.json 中存在已验证的 mp.weixin.qq.com 或搜狗 link 跳转链接时，阅读面板会显示「打开原文」。本站不会用搜狗搜索页冒充原文链接。",
  },
  {
    question: "如何追踪某个公众号？",
    answer:
      "访问 /accounts 查看已追踪公众号，并在 data/accounts.json 中维护列表；单篇正文抓取请使用 x-fetcher 的 fetch_wechat.py（单 URL，非公众号历史）。",
  },
];

export default function HomePage() {
  const scans = getScans();
  const catalog = getCatalog();
  const articleTotal = catalog.articles.length;
  const latestScan = scans[0];
  const articles = getAllArticles();
  const directLinkTotal = articles.filter((article) =>
    isAllowedArticleUrl(article.url),
  ).length;

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }}
      />
      <section className="bg-marrs text-white" aria-labelledby="home-hero-title">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-xs tracking-[0.28em] text-white/70 uppercase">
            Track Scan
          </p>
          <h1
            id="home-hero-title"
            className="mt-4 max-w-2xl text-4xl leading-tight tracking-tight sm:text-5xl"
          >
            赛道扫描
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">
            从微信读书等来源扫出一条赛道。按日期归档，用链接记住正在读的那一篇。
          </p>
          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/20 pt-8 text-sm">
            <div>
              <dt className="text-white/65">已归档扫描</dt>
              <dd className="mt-1 text-white">{scans.length} 次</dd>
            </div>
            <div>
              <dt className="text-white/65">文章条目</dt>
              <dd className="mt-1 text-white">{articleTotal} 篇</dd>
            </div>
            <div>
              <dt className="text-white/65">已验证直链</dt>
              <dd className="mt-1 text-white">{directLinkTotal} 篇</dd>
            </div>
            {latestScan ? (
              <div>
                <dt className="text-white/65">最近更新</dt>
                <dd className="mt-1 text-white">
                  <time dateTime={latestScan.date}>
                    {formatScanDate(latestScan.date)}
                  </time>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12"
        aria-labelledby="home-search-title"
      >
        <h2 id="home-search-title" className="sr-only">
          全站搜索
        </h2>
        <HomeSearch articles={articles} />
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-5 pb-10 sm:px-8"
        aria-labelledby="home-faq-title"
      >
        <h2 id="home-faq-title" className="text-2xl tracking-tight text-ink">
          常见问题
        </h2>
        <div className="mt-6 space-y-5">
          {faq.map((item) => (
            <article
              key={item.question}
              className="rounded-sm bg-paper p-5 ring-1 ring-line"
            >
              <h3 className="text-lg text-ink">{item.question}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{item.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20"
        aria-labelledby="home-scans-title"
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.14em] text-marrs">归档</p>
            <h2 id="home-scans-title" className="mt-2 text-2xl tracking-tight text-ink">
              最近扫描
            </h2>
          </div>
          <p className="text-sm text-muted">{scans.length} 次</p>
        </div>
        <div className="mt-8 space-y-5">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      </section>
    </main>
  );
}
