#!/usr/bin/env node
/**
 * Download WeChat article bodies for one tracked account (verified mp URLs only).
 * Requires x-fetcher checkout: set X_FETCHER_PATH to repo root containing fetch_wechat.py
 *
 * Usage:
 *   node scripts/download-account-bodies.mjs --account "水金聊投资"
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const accountIdx = args.indexOf("--account");
const accountName = accountIdx >= 0 ? args[accountIdx + 1] : null;
if (!accountName) {
  console.error("Usage: node scripts/download-account-bodies.mjs --account \"公众号名称\"");
  process.exit(1);
}

const catalog = JSON.parse(readFileSync(join(root, "data/index.json"), "utf8"));
const accounts = JSON.parse(readFileSync(join(root, "data/accounts.json"), "utf8"));
const account = accounts.accounts.find((a) => a.name === accountName);
if (!account) {
  console.error(`Account not found in data/accounts.json: ${accountName}`);
  process.exit(1);
}

const SYNTH =
  /^https?:\/\/mp\.weixin\.qq\.com\/s\/(?:20\d{2}-\d{2}-\d{2}-weread-\d+|[^?]+)$/i;

function allowed(url) {
  const t = (url ?? "").trim();
  if (!t.startsWith("http")) return false;
  if (/weixin\.sogou\.com\/weixin\?/i.test(t)) return false;
  if (/weixin\.sogou\.com\/link/i.test(t)) return true;
  if (t.includes("mp.weixin.qq.com")) {
    if (SYNTH.test(t) && !t.includes("__biz=")) return false;
    return t.includes("__biz=") || (t.includes("mid=") && t.includes("sn="));
  }
  return false;
}

const items = catalog.articles.filter(
  (a) => a.account === accountName && allowed(a.url),
);
const outDir = join(root, "data/downloads", account.slug);
mkdirSync(outDir, { recursive: true });

const xFetcher =
  process.env.X_FETCHER_PATH ??
  join(process.env.HOME ?? "", ".claude/skills/x-fetcher");
const fetchScript = join(xFetcher, "fetch_wechat.py");
if (!existsSync(fetchScript)) {
  console.error(
    `fetch_wechat.py not found at ${fetchScript}. Clone https://github.com/zhuima/x-fetcher and set X_FETCHER_PATH.`,
  );
  process.exit(1);
}

console.log(`Account: ${accountName} (${items.length} URLs with verified links)`);
for (const article of items) {
  const safe = article.id.replace(/[^\w.-]+/g, "_");
  const mdPath = join(outDir, `${safe}.md`);
  console.log(`Fetching ${article.id} ...`);
  const result = spawnSync("python3", [fetchScript, article.url], {
    cwd: xFetcher,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    console.error(result.stderr || result.stdout);
    continue;
  }
  writeFileSync(
    mdPath,
    `# ${article.title}\n\n- account: ${article.account}\n- published: ${article.publishedLabel}\n- url: ${article.url}\n\n---\n\n${result.stdout}\n`,
  );
  console.log(`Wrote ${mdPath}`);
}

console.log("Done. Note: x-fetcher fetches one mp URL at a time, not full account history.");
