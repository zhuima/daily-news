import { isAllowedArticleUrl } from "@/lib/articles";
import type { ArticleEngagement } from "@/lib/engagement/types";
import {
  parseEngagementFromCsvColumns,
  parseEngagementFromRecord,
} from "@/lib/engagement/parse-export-fields";

export type WechatExportRow = {
  title: string;
  account: string;
  url: string;
  publishedLabel?: string;
  summary?: string;
  engagement?: ArticleEngagement;
};

function pickString(
  record: Record<string, unknown>,
  keys: string[],
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  for (const key of Object.keys(record)) {
    const lower = key.toLowerCase();
    if (keys.some((k) => lower.includes(k.toLowerCase()))) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }
  return "";
}

export function parseWechatExportJson(raw: unknown): WechatExportRow[] {
  const list = Array.isArray(raw)
    ? raw
    : typeof raw === "object" &&
        raw !== null &&
        Array.isArray((raw as { data?: unknown }).data)
      ? (raw as { data: unknown[] }).data
      : null;

  if (!list) {
    throw new Error("JSON 应为数组，或 { data: [...] }（wechatDownload export_article_data）");
  }

  const rows: WechatExportRow[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const title = pickString(record, [
      "title",
      "article_title",
      "name",
      "标题",
    ]);
    const account = pickString(record, [
      "account",
      "nickname",
      "author",
      "公众号",
      "account_name",
    ]);
    const url = pickString(record, [
      "url",
      "link",
      "content_url",
      "article_url",
      "链接",
    ]);
    if (!title || !url) continue;
    if (!isAllowedArticleUrl(url)) continue;

    rows.push({
      title,
      account: account || "未知公众号",
      url,
      publishedLabel: pickString(record, [
        "publishedLabel",
        "publish_time",
        "publishTime",
        "datetime",
        "time",
      ]),
      summary: pickString(record, ["summary", "digest", "abstract", "desc", "摘要"]),
      engagement: parseEngagementFromRecord(record),
    });
  }

  if (rows.length === 0) {
    throw new Error("未解析到带可验证 mp / sogou link 的记录");
  }
  return rows;
}

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }
    current += ch;
  }
  out.push(current.trim());
  return out;
}

export function parseWechatExportCsv(text: string): WechatExportRow[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) {
    throw new Error("CSV 至少需要表头与一行数据");
  }
  const headers = parseCsvLine(lines[0]);
  const headersLower = headers.map((h) => h.toLowerCase());
  const idx = (names: string[]) =>
    headersLower.findIndex((h) => names.some((n) => h.includes(n)));

  const titleI = idx(["title", "标题"]);
  const urlI = idx(["url", "link", "链接"]);
  const accountI = idx(["account", "nickname", "公众号", "author"]);
  if (titleI < 0 || urlI < 0) {
    throw new Error("CSV 需包含 title/标题 与 url/link/链接 列");
  }

  const rows: WechatExportRow[] = [];
  for (const line of lines.slice(1)) {
    const cols = parseCsvLine(line);
    const title = cols[titleI]?.trim() ?? "";
    const url = cols[urlI]?.trim() ?? "";
    const account =
      accountI >= 0 ? (cols[accountI]?.trim() ?? "") : "未知公众号";
    if (!title || !url || !isAllowedArticleUrl(url)) continue;
    rows.push({
      title,
      account,
      url,
      engagement: parseEngagementFromCsvColumns(headers, cols),
    });
  }

  if (rows.length === 0) {
    throw new Error("CSV 中无通过链接校验的行");
  }
  return rows;
}
