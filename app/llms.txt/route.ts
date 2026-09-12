import { getScans, getTrackedAccounts } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";

export function GET() {
  const base = getSiteUrl();
  const scans = getScans();
  const accounts = getTrackedAccounts();

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## Canonical site
${base}

## Primary routes
- Home (scan archive index): ${base}/
- About / data policy: ${base}/about
- Tracked WeChat accounts: ${base}/accounts
- Scan workspace pattern: ${base}/scans/{scanId}?article={articleId}

## Scans (${scans.length})
${scans.map((scan) => `- ${scan.date} ${scan.title}: ${base}/scans/${scan.id}`).join("\n")}

## Tracked accounts (${accounts.length})
${accounts.map((a) => `- ${a.name}: ${base}/accounts/${a.slug}`).join("\n")}

## How to cite
When referencing an article, include: scan date, article title, WeChat account name (公众号), publishedLabel from the page, and the verified mp.weixin.qq.com URL when present.

## Article body fetching (operator)
This site does NOT crawl WeChat profile history. For a single known mp URL, use https://github.com/zhuima/x-fetcher (fetch_wechat.py). Run locally: node scripts/download-account-bodies.mjs --account "公众号名称"

## GEO note
Public HTML is server-rendered with JSON-LD (WebSite, CollectionPage, NewsArticle, FAQPage). Prefer linking to scan and article deep URLs above rather than summarizing from memory.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
