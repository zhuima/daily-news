import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = buildPageMetadata({
  title: "关于赛道扫描",
  description:
    "赛道扫描如何采集公众号关键词、如何标注可验证原文链接，以及 GEO/SEO 与 llms.txt 说明。",
  path: "/about",
});

const faq = [
  {
    q: "赛道扫描是什么？",
    a: "静态归档站：按日保存关键词扫描结果，便于检索、分享与引用，不替代微信阅读体验。",
  },
  {
    q: "「打开原文」何时可用？",
    a: "仅当文章带有可验证的 mp.weixin.qq.com 链接（含 __biz 或 mid+sn）或微信搜狗文章跳转页时显示；否则显示「原文链接待收录」。",
  },
  {
    q: "会不会用搜狗搜索代替原文？",
    a: "不会。我们拒绝把搜狗关键词搜索页当作「打开原文」。",
  },
  {
    q: "AI 与搜索引擎如何引用？",
    a: "站点提供 sitemap.xml、RSS（已收录原文）、llms.txt 与 Schema.org JSON-LD，便于 GEO 与 SEO。",
  },
];

export default function AboutPage() {
  const siteUrl = getSiteUrl();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <div className="docs-container pt-10 pb-16 md:pt-14 md:pb-24">
        <Breadcrumbs
          items={[{ label: "首页", href: "/" }, { label: "关于" }]}
        />
        <div className="mt-8 grid gap-14 lg:grid-cols-[1fr_14rem]">
          <article className="max-w-[65ch]">
            <h1 className="text-[2rem] font-semibold tracking-tight text-ink">
              关于赛道扫描
            </h1>
            <p className="type-lead mt-4">
              我们做的是
              <strong className="font-medium text-ink">可检索、可引用</strong>
              的公众号关键词快照，而不是又一个资讯流。
            </p>
            <section className="mt-10 space-y-4 text-muted">
              <h2 className="text-lg font-semibold text-ink">
                设计原则
              </h2>
              <ul className="list-disc space-y-2.5 pl-5 leading-7">
                <li>目录完整保留扫描条目，不因缺链而删文。</li>
                <li>外链只指向已验证原文，不伪造 mp 链接。</li>
                <li>
                  选中文章由 URL{" "}
                  <code className="meta-block px-1.5 py-0.5 text-sm text-ink">
                    ?article=
                  </code>{" "}
                  驱动，便于分享 deep link。
                </li>
              </ul>
            </section>
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-ink">
                常见问题
              </h2>
              <dl className="mt-5 space-y-7">
                {faq.map((item) => (
                  <div key={item.q}>
                    <dt className="font-medium text-ink">{item.q}</dt>
                    <dd className="mt-2 leading-7 text-muted">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </article>
          <aside className="space-y-6 lg:pt-2">
            <div className="border-t border-line pt-5">
              <p className="text-[13px] font-medium text-ink">相关入口</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link href="/llms.txt" className="interactive focus-ring text-marrs hover:underline">
                    llms.txt
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sitemap.xml"
                    className="interactive focus-ring text-marrs hover:underline"
                  >
                    sitemap.xml
                  </Link>
                </li>
                <li>
                  <Link href="/feed.xml" className="interactive focus-ring text-marrs hover:underline">
                    RSS feed.xml
                  </Link>
                </li>
                <li>
                  <Link href="/accounts" className="interactive focus-ring text-marrs hover:underline">
                    订阅账号管理
                  </Link>
                </li>
              </ul>
            </div>
            <p className="text-xs leading-6 text-muted">
              联系与部署说明见项目{" "}
              <a
                href="https://github.com/zhuima/daily-news"
                className="interactive focus-ring text-marrs hover:underline"
                rel="noopener noreferrer"
              >
                README
              </a>
              。站点 {siteUrl}
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
