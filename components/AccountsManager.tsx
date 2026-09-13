"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { slugifyAccount } from "@/lib/slug";
import type { TrackedAccount } from "@/lib/accounts-types";
type ArticleStats = Record<
  string,
  { total: number; linked: number }
>;

type ScanOption = { id: string; title: string };

export function AccountsManager({
  initialAccounts,
  articleStats,
  persistence,
  adminConfigured,
  scanOptions,
}: {
  initialAccounts: TrackedAccount[];
  articleStats: ArticleStats;
  persistence: boolean;
  adminConfigured: boolean;
  scanOptions: ScanOption[];
}) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [adminToken, setAdminToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [addedAt, setAddedAt] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [importScanId, setImportScanId] = useState(scanOptions[0]?.id ?? "");
  const [importFile, setImportFile] = useState<File | null>(null);
  const [tryMpEngagement, setTryMpEngagement] = useState(false);

  const previewSlug = useMemo(() => {
    if (customSlug.trim()) return customSlug.trim();
    if (!name.trim()) return "";
    return slugifyAccount(name);
  }, [customSlug, name]);

  const authHeaders = useCallback((): HeadersInit => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (adminToken) {
      headers.Authorization = `Bearer ${adminToken}`;
    }
    return headers;
  }, [adminToken]);

  async function unlockAdmin() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/accounts/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: adminToken }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "解锁失败");
      }
      setUnlocked(true);
      setMessage("已解锁管理操作（本会话有效）");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "解锁失败");
    } finally {
      setBusy(false);
    }
  }

  async function refreshList() {
    const res = await fetch("/api/accounts", { cache: "no-store" });
    const data = (await res.json()) as { accounts: TrackedAccount[] };
    setAccounts(data.accounts);
  }

  async function handleAdd(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          name,
          slug: customSlug.trim() || undefined,
          notes,
          addedAt: new Date(addedAt).toISOString(),
        }),
      });
      const data = (await res.json()) as {
        accounts?: TrackedAccount[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "添加失败");
      setAccounts(data.accounts ?? []);
      setName("");
      setCustomSlug("");
      setNotes("");
      setMessage("已添加公众号");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "添加失败");
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(slug: string, accountName: string) {
    if (
      !window.confirm(`确认移除追踪公众号「${accountName}」？此操作不可撤销。`)
    ) {
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const res = await fetch(
        `/api/accounts?slug=${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
          headers: authHeaders(),
        },
      );
      const data = (await res.json()) as {
        accounts?: TrackedAccount[];
        error?: string;
      };
      if (!res.ok) throw new Error(data.error ?? "删除失败");
      setAccounts(data.accounts ?? []);
      setMessage("已移除");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "删除失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <section
        className="rounded-sm border border-line bg-canvas p-6"
        aria-labelledby="accounts-admin-title"
      >
        <h2 id="accounts-admin-title" className="text-lg text-ink">
          在线管理
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          数据保存在 Cloudflare D1。
          {persistence
            ? " 当前运行环境已绑定 D1，可进行增删与链接导入。"
            : " 当前未绑定 D1（本地 next dev 仅读 JSON 种子）；请用 wrangler pages dev 或 Cloudflare Pages 部署。"}
          {adminConfigured ? "" : " 另需配置 ACCOUNTS_ADMIN_TOKEN。"}
        </p>

        {!unlocked ? (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="flex-1 text-sm">
              <span className="text-muted">管理口令</span>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-paper px-3"
                placeholder="ACCOUNTS_ADMIN_TOKEN"
              />
            </label>
            <button
              type="button"
              disabled={busy || !adminToken}
              onClick={unlockAdmin}
              className="h-11 rounded-sm bg-marrs px-5 text-sm text-white disabled:opacity-50"
            >
              解锁
            </button>
          </div>
        ) : (
          <p className="mt-3 text-sm text-marrs">管理已解锁</p>
        )}

        {message ? (
          <p className="mt-3 text-sm text-ink" role="status">
            {message}
          </p>
        ) : null}
      </section>

      {unlocked ? (
        <>
        <section className="rounded-sm bg-paper p-6 ring-1 ring-line">
          <h2 className="text-lg text-ink">导入文章链接（wechatDownload）</h2>
          <p className="mt-2 text-sm leading-7 text-muted">
            上传 <code className="rounded bg-canvas px-1">export_article_data</code>{" "}
            导出的 CSV/JSON（可含阅读/点赞/评论列），仅写入可验证 mp / sogou link，不批量抓正文。说明见{" "}
            <Link href="https://github.com/zhuima/daily-news/blob/main/docs/wechat-download-import.md" className="text-marrs hover:underline">
              docs/wechat-download-import.md
            </Link>
            。
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              <span className="text-muted">扫描批次</span>
              <select
                value={importScanId}
                onChange={(e) => setImportScanId(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-canvas px-3"
              >
                {scanOptions.map((scan) => (
                  <option key={scan.id} value={scan.id}>
                    {scan.id} · {scan.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="text-muted">CSV / JSON 文件</span>
              <input
                type="file"
                accept=".csv,.json,application/json,text/csv"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
                className="mt-2 block w-full text-sm"
              />
            </label>
            <label className="flex items-start gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={tryMpEngagement}
                onChange={(e) => setTryMpEngagement(e.target.checked)}
                className="mt-1"
              />
              <span className="text-muted">
                导出无互动列时，尝试从 mp 页解析阅读/点赞（常失败，不阻塞导入）
              </span>
            </label>
            <div className="sm:col-span-2">
              <button
                type="button"
                disabled={busy || !importFile || !importScanId || !persistence}
                onClick={async () => {
                  if (!importFile) return;
                  setBusy(true);
                  setMessage(null);
                  try {
                    const form = new FormData();
                    form.set("scanId", importScanId);
                    form.set("file", importFile);
                    if (tryMpEngagement) form.set("tryMpEngagement", "1");
                    const res = await fetch("/api/accounts/import", {
                      method: "POST",
                      headers: adminToken
                        ? { Authorization: `Bearer ${adminToken}` }
                        : {},
                      body: form,
                    });
                    const data = (await res.json()) as {
                      error?: string;
                      imported?: number;
                      matched?: number;
                      inserted?: number;
                      skipped?: number;
                      engagementFromMp?: number;
                    };
                    if (!res.ok) throw new Error(data.error ?? "导入失败");
                    setMessage(
                      `导入完成：更新 ${data.matched ?? 0} 条，新增 ${data.inserted ?? 0} 条，跳过 ${data.skipped ?? 0} 条${
                        data.engagementFromMp
                          ? `；${data.engagementFromMp} 条 mp 页解析到互动`
                          : ""
                      }`,
                    );
                    setImportFile(null);
                  } catch (error) {
                    setMessage(
                      error instanceof Error ? error.message : "导入失败",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
                className="h-11 rounded-sm bg-marrs px-5 text-sm text-white disabled:opacity-50"
              >
                导入链接到 D1
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-sm bg-paper p-6 ring-1 ring-line">
          <h2 className="text-lg text-ink">添加公众号</h2>
          <form onSubmit={handleAdd} className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm sm:col-span-2">
              <span className="text-muted">公众号名称 *</span>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-canvas px-3"
              />
            </label>
            <label className="text-sm">
              <span className="text-muted">slug（可选）</span>
              <input
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-canvas px-3"
                placeholder={previewSlug || "自动生成"}
              />
            </label>
            <label className="text-sm">
              <span className="text-muted">addedAt</span>
              <input
                type="date"
                value={addedAt}
                onChange={(e) => setAddedAt(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-canvas px-3"
              />
            </label>
            <label className="text-sm sm:col-span-2">
              <span className="text-muted">备注</span>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-2 h-11 w-full rounded-sm border border-line bg-canvas px-3"
              />
            </label>
            <p className="text-xs text-muted sm:col-span-2">
              预览 slug：<span className="text-marrs">{previewSlug || "—"}</span>
            </p>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="h-11 rounded-sm bg-marrs px-5 text-sm text-white disabled:opacity-50"
              >
                添加
              </button>
            </div>
          </form>
        </section>
        </>
      ) : null}

      <section aria-labelledby="accounts-list-title">
        <div className="flex items-center justify-between gap-3">
          <h2 id="accounts-list-title" className="text-xl tracking-tight text-ink">
            已追踪（{accounts.length}）
          </h2>
          <button
            type="button"
            onClick={() => refreshList()}
            className="text-sm text-marrs hover:text-marrs-deep"
          >
            刷新
          </button>
        </div>
        <ul className="mt-6 divide-y divide-line rounded-sm bg-paper ring-1 ring-line">
          {accounts.map((account) => {
            const stats = articleStats[account.name] ?? { total: 0, linked: 0 };
            return (
              <li
                key={account.slug}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/accounts/${account.slug}`}
                    className="text-lg text-ink hover:text-marrs"
                  >
                    {account.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">
                    slug: {account.slug}
                    <span className="mx-2">·</span>
                    <time dateTime={account.addedAt}>{account.addedAt}</time>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {stats.total} 篇扫描条目 · {stats.linked} 篇已收录 mp 链接
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/accounts/${account.slug}`} className="text-sm text-marrs">
                    查看 →
                  </Link>
                  {unlocked ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleRemove(account.slug, account.name)}
                      className="text-sm text-red-700 hover:underline disabled:opacity-50"
                    >
                      移除
                    </button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
