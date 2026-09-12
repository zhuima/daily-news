import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于数据",
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-display text-xs tracking-[0.2em] text-marrs uppercase">
        About
      </p>
      <h1 className="mt-3 text-4xl tracking-tight">数据怎么来、怎么读</h1>
      <div className="mt-10 space-y-10 text-[15px] leading-8 text-ink/85">
        <section>
          <h2 className="text-xl tracking-tight text-ink">这不是实时新闻站</h2>
          <p className="mt-3">
            「赛道扫描」把某一次关键词扫描的结果做成静态归档。当前仓库只提交一份{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              data/index.json
            </code>
            ，页面在构建时读入，不连微信、也不在服务器上再抓一遍。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">一次扫描里有什么</h2>
          <p className="mt-3">
            每个 scan 有日期、标题、来源和篇数。列表只收录同时满足：公众号名称、发布时间、可验证原文链接（优先{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              mp.weixin.qq.com
            </code>{" "}
            带 <code>__biz</code> / <code>mid</code>+<code>sn</code> 参数）。缺字段或合成占位链接的条目不会出现在 UI，而是写入{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              data/rejected-articles.json
            </code>
            。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">为什么用 URL 选文章</h2>
          <p className="mt-3">
            阅读面板只认{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              ?article=&lt;id&gt;
            </code>
            。服务端页面读这个参数，再把{" "}
            <code className="rounded-sm bg-paper px-1.5 py-0.5 ring-1 ring-line">
              selectedId
            </code>{" "}
            传给列表和面板。刷新、分享、后退都指向同一篇，不把「正在读哪篇」放进 Zustand 或组件 state。
          </p>
          <p className="mt-3">
            Zustand 只存筛选：检索词 chip 与关键词搜索框。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">「打开原文」</h2>
          <p className="mt-3">
            列表中的每篇都有「打开原文」按钮，指向已校验的 url。不会把无链接摘要放进可选列表。
          </p>
        </section>
        <section>
          <h2 className="text-xl tracking-tight text-ink">如何追加一次扫描</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>在 scans 数组增加一条 id / date / title / sources / articleCount。</li>
            <li>把该日文章写入 articles，id 建议 <code>日期-来源-序号</code>。</li>
            <li>articleCount 与当日文章数保持一致，然后重新构建。</li>
          </ol>
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
