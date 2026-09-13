import { getAllArticles, getScans } from "@/lib/data";

export const dynamic = "force-dynamic";
import { isAllowedArticleUrl } from "@/lib/articles";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

export async function GET() {
  const scans = await getScans();
  const articles = (await getAllArticles())
    .filter((article) => isAllowedArticleUrl(article.url))
    .slice(0, 50);

  const items = articles
    .map((article) => {
      const scan = scans.find((s) => s.date === article.scanDate);
      const link = absoluteUrl(
        `/scans/${article.scanDate}?article=${encodeURIComponent(article.id)}`,
      );
      return `<item>
  <title><![CDATA[${article.title}]]></title>
  <link>${link}</link>
  <guid isPermaLink="true">${link}</guid>
  <pubDate>${new Date(`${article.scanDate}T12:00:00+08:00`).toUTCString()}</pubDate>
  <description><![CDATA[${article.account} · ${article.publishedLabel} — ${article.summary}]]></description>
  <category><![CDATA[${article.query}]]></category>
  ${scan ? `<category><![CDATA[${scan.title}]]></category>` : ""}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${absoluteUrl("/")}</link>
    <description>赛道扫描 — 已验证直链文章 RSS</description>
    <language>zh-CN</language>
    <atom:link href="${absoluteUrl("/feed.xml")}" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
