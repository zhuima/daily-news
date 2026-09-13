import type { TrackedAccount } from "@/lib/accounts-types";
import { getDb } from "@/lib/db/client";
import {
  assertUniqueSlug,
  deleteAccountBySlug,
  getAccountBySlugFromDb,
  insertAccount,
  proposeSlug,
} from "@/lib/db/accounts";
import { readAccountsDocument } from "@/lib/accounts-store";

export async function listTrackedAccounts(): Promise<TrackedAccount[]> {
  const doc = await readAccountsDocument();
  return doc.accounts;
}

export async function getTrackedAccountBySlug(
  slug: string,
): Promise<TrackedAccount | undefined> {
  const db = await getDb();
  if (db) {
    const fromDb = await getAccountBySlugFromDb(db, slug);
    if (fromDb) return fromDb;
  }
  const doc = await readAccountsDocument();
  return doc.accounts.find((account) => account.slug === slug);
}

export async function addTrackedAccount(input: {
  name: string;
  slug?: string;
  notes?: string;
  addedAt?: string;
}): Promise<TrackedAccount> {
  const name = input.name?.trim();
  if (!name) throw new Error("公众号名称不能为空");

  const db = await getDb();
  if (!db) {
    throw new Error(
      "D1 未绑定，无法持久化公众号。请使用 wrangler pages dev / Cloudflare 部署。",
    );
  }

  const slug = proposeSlug(name, input.slug);
  await assertUniqueSlug(db, slug);

  return insertAccount(db, {
    slug,
    name,
    notes: input.notes,
    addedAt: input.addedAt?.trim() || new Date().toISOString(),
  });
}

export async function removeTrackedAccount(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("D1 未绑定，无法删除公众号。");
  }
  const ok = await deleteAccountBySlug(db, slug);
  if (!ok) throw new Error("未找到该 slug");
}
