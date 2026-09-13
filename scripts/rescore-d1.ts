#!/usr/bin/env npx tsx
/**
 * Recompute 文章质量分 for all rows in D1 (lib/scoring/content-quality-score.ts).
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { scoreArticleQuality } from "../lib/scoring/content-quality-score";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const remote = args.includes("--remote");
const jsonOnly = args.includes("--json-only");

function sqlString(value: string) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function scoreRow(row: {
  title: string;
  summary: string;
  query: string;
  url: string;
  published_label: string;
  has_direct_link: number;
}) {
  return scoreArticleQuality({
    title: row.title,
    summary: row.summary,
    publishedLabel: row.published_label,
  });
}

function rescoreJsonCatalog() {
  const path = join(root, "data/index.json");
  const catalog = JSON.parse(readFileSync(path, "utf8")) as {
    articles: Array<Record<string, unknown>>;
  };
  for (const article of catalog.articles) {
    const { score, scoreReason } = scoreArticleQuality({
      title: String(article.title ?? ""),
      summary: String(article.summary ?? ""),
      publishedLabel: String(article.publishedLabel ?? ""),
    });
    article.score = score;
    article.scoreReason = scoreReason;
  }
  writeFileSync(path, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Updated scores in ${path} (${catalog.articles.length} articles)`);
}

function fetchArticlesFromD1(): Array<{
  id: string;
  title: string;
  summary: string;
  query: string;
  url: string;
  published_label: string;
  has_direct_link: number;
}> {
  const flag = remote ? "--remote" : "--local";
  const cmd = `npx wrangler d1 execute track-scan-db ${flag} --json --command "SELECT id, title, summary, query, url, published_label, has_direct_link FROM articles"`;
  const out = execSync(cmd, { cwd: root, encoding: "utf8", maxBuffer: 20 * 1024 * 1024 });
  const parsed = JSON.parse(out) as Array<{
    results?: Array<{
      id: string;
      title: string;
      summary: string;
      query: string;
      url: string;
      published_label: string;
      has_direct_link: number;
    }>;
  }>;
  const first = parsed[0];
  return first?.results ?? [];
}

function applyRescoreToD1() {
  const rows = fetchArticlesFromD1();
  if (rows.length === 0) {
    console.log("No articles in D1 (or query failed).");
    return;
  }
  const statements = rows.map((row) => {
    const { score, scoreReason } = scoreRow(row);
    return `UPDATE articles SET score = ${score}, score_reason = ${sqlString(scoreReason)} WHERE id = ${sqlString(row.id)};`;
  });
  const sqlPath = join(root, "scripts/rescore-generated.sql");
  writeFileSync(sqlPath, `-- rescore-d1.ts\n${statements.join("\n")}\n`);
  const flag = remote ? "--remote" : "--local";
  execSync(
    `npx wrangler d1 execute track-scan-db ${flag} --file=${sqlPath}`,
    { stdio: "inherit", cwd: root },
  );
  console.log(`Rescored ${rows.length} articles (${remote ? "remote" : "local"} D1).`);
}

if (jsonOnly) {
  rescoreJsonCatalog();
} else {
  rescoreJsonCatalog();
  applyRescoreToD1();
}
