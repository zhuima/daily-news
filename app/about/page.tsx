import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "关于数据",
  description:
    "赛道扫描的数据来源、URL 策略、SEO/GEO 说明，以及如何使用 x-fetcher 下载单篇微信公众号正文。",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "打开原文链接从哪里来？",
              acceptedAnswer: {
                "@type": "Answer",
                text: "仅使用 data/index.json 中已验证的 mp.weixin.qq.com 或搜狗 link 跳转 URL。禁止用搜狗搜索页作为打开原文。",
              },
            },
            {
              "@type": "Question",
              name: "如何下载文章正文？",
              acceptedAnswer: {
                "@type": "Answer",
                text: "使用 github.com/zhuima/x-fetcher 的 fetch_wechat.py 对单篇 mp URL 抓取；账号维度批量请运行 scripts/download-account-bodies.mjs（仅已收录链接）。",
              },
            },
          ],
        }}
      />
      <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
        About
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">数据怎么来、怎么读</h1>
      <div className="mt-10 space-y-10 text-[15px] leading-8 text-ink/85">
        <section>
          <h2 className="text-xl tracking-tight text-ink">这不是实时新闻站</h2>
          <p className="mt-3">
            「赛道扫描」把某一次关键词扫描的结果做成静态归档。当前仓库提交{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              data/index.json
            </code>
            、{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              data/accounts.json
            </code>
            ，页面在构建时读入。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">链接策略（禁止搜索页）</h2>
          <p className="mt-3">
            「打开原文」只允许跳转到已验证的{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              mp.weixin.qq.com
            </code>{" "}
            或{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              weixin.sogou.com/link
            </code>
            文章跳转。合成占位路径与搜狗搜索页不会出现在 CTA 中；缺链条目显示「原文链接待收录」。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">URL 选文章</h2>
          <p className="mt-3">
            阅读面板使用{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              ?article=&lt;id&gt;
            </code>
            。Zustand 只存检索词与关键词搜索。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">SEO / GEO</h2>
          <p className="mt-3">
            站点提供 sitemap.xml、robots.txt、Open Graph/Twitter 元数据、JSON-LD（WebSite、CollectionPage、NewsArticle、FAQPage）以及{" "}
            <Link href="/llms.txt" className="text-marrs">
              /llms.txt
            </Link>{" "}
            供检索与生成式引擎引用。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">公众号追踪与正文</h2>
          <p className="mt-3">
            见{" "}
            <Link href="/accounts" className="text-marrs">
              /accounts
            </Link>
            （浏览器内增删，Vercel KV 持久化，需配置 ACCOUNTS_ADMIN_TOKEN）。x-fetcher 抓取单篇 mp 文章，不替代微信客户端的公众号历史接口。
          </p>
        </section>
        <p>
          <Link href="/" className="text-marrs hover:text-marrs-deep">
            返回扫描列表
          </Link>
        </p>
      </div>
    </main>
  );
}
