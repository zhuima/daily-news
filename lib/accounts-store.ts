import accountsSeed from "@/data/accounts.json";
import type { AccountsDocument, TrackedAccount } from "@/lib/accounts-types";
import { slugifyAccount } from "@/lib/slug";
import { getDb } from "@/lib/db/client";
import { insertAccount, listAccountsFromDb } from "@/lib/db/accounts";

function seedDocument(): AccountsDocument {
  const seed = accountsSeed as AccountsDocument;
  return {
    version: seed.version ?? "1.0.0",
    updatedAt: seed.updatedAt ?? new Date().toISOString(),
    accounts: seed.accounts.map((account) => ({
      ...account,
      slug: account.slug || slugifyAccount(account.name),
      addedAt: account.addedAt || new Date().toISOString().slice(0, 10),
    })),
  };
}

export function normalizeDocument(doc: AccountsDocument): AccountsDocument {
  const seen = new Set<string>();
  const accounts: TrackedAccount[] = [];
  for (const raw of doc.accounts) {
    const name = raw.name?.trim();
    if (!name) continue;
    let slug = (raw.slug?.trim() || slugifyAccount(name)).replace(/=+$/, "");
    if (seen.has(slug)) {
      let i = 2;
      while (seen.has(`${slug}-${i}`)) i += 1;
      slug = `${slug}-${i}`;
    }
    seen.add(slug);
    accounts.push({
      slug,
      name,
      notes: raw.notes?.trim() || "",
      addedAt: raw.addedAt || new Date().toISOString(),
    });
  }
  return {
    version: doc.version ?? "1.0.0",
    updatedAt: doc.updatedAt ?? new Date().toISOString(),
    accounts,
  };
}

export async function readAccountsDocument(): Promise<AccountsDocument> {
  const db = await getDb();
  if (db) {
    try {
      const accounts = await listAccountsFromDb(db);
      if (accounts.length > 0) {
        return {
          version: "1.0.0",
          updatedAt: new Date().toISOString(),
          accounts,
        };
      }
    } catch {
      /* D1 未 migrate 或 build 环境无 schema */
    }
  }
  return normalizeDocument(seedDocument());
}

export async function writeAccountsDocument(
  doc: AccountsDocument,
): Promise<AccountsDocument> {
  const db = await getDb();
  if (!db) {
    throw new Error(
      "D1 未绑定：请在 Cloudflare Pages（OpenNext）或 wrangler dev 下运行，并执行 migrations + seed。本地纯 next dev 仅可读 JSON 种子。",
    );
  }
  const next = normalizeDocument({
    ...doc,
    updatedAt: new Date().toISOString(),
  });
  await db.prepare("DELETE FROM accounts").run();
  for (const account of next.accounts) {
    await insertAccount(db, {
      name: account.name,
      slug: account.slug,
      notes: account.notes,
      addedAt: account.addedAt,
    });
  }
  return next;
}

