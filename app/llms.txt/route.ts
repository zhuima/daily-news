import { listTrackedAccounts } from "@/lib/accounts-api";
import { getScans } from "@/lib/data";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";

export async function GET() {
  const base = getSiteUrl();
  const scans = getScans();
  const accounts = await listTrackedAccounts();

  const body = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## Canonical site
${base}

## Primary routes
- Home (scan archive index): ${base}/
- About / data policy: ${base}/about
- Tracked WeChat accounts (online admin): ${base}/accounts
- Scan workspace pattern: ${base}/scans/{scanId}?article={articleId}

## Scans (${scans.length})
${scans.map((scan) => `- ${scan.date} ${scan.title}: ${base}/scans/${scan.id}`).join("\n")}

## Tracked accounts (${accounts.length})
${accounts.map((a) => `- ${a.name}: ${base}/accounts/${a.slug}`).join("\n")}

## How to cite
When referencing an article, include: scan date, article title, WeChat account name (公众号), publishedLabel from the page, and the verified mp.weixin.qq.com URL when present.

## Article body fetching (operator)
Single mp URL only: https://github.com/zhuima/x-fetcher (fetch_wechat.py). Not full WeChat account history.

## Accounts persistence
Tracked accounts list is stored in Vercel KV at runtime; seed from data/accounts.json when empty.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
