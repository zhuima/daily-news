import accountsSeed from "@/data/accounts.json";
import type { AccountsDocument, TrackedAccount } from "@/lib/accounts-types";
import { slugifyAccount } from "@/lib/slug";

const KV_KEY = "track-scan:accounts:v1";

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

function kvConfigured(): boolean {
  return Boolean(
    process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN,
  );
}

async function kvGet(): Promise<AccountsDocument | null> {
  if (!kvConfigured()) return null;
  const { kv } = await import("@vercel/kv");
  return (await kv.get<AccountsDocument>(KV_KEY)) ?? null;
}

async function kvSet(doc: AccountsDocument): Promise<void> {
  if (!kvConfigured()) {
    throw new Error(
      "KV_REST_API_URL / KV_REST_API_TOKEN 未配置，无法在 Vercel 上持久化公众号列表。请在 Vercel 集成 Upstash Redis。",
    );
  }
  const { kv } = await import("@vercel/kv");
  await kv.set(KV_KEY, doc);
}

export async function readAccountsDocument(): Promise<AccountsDocument> {
  const cached = await kvGet();
  if (cached?.accounts?.length) {
    return normalizeDocument(cached);
  }
  const seed = seedDocument();
  if (kvConfigured()) {
    await kvSet(seed);
  }
  return seed;
}

export async function writeAccountsDocument(
  doc: AccountsDocument,
): Promise<AccountsDocument> {
  const next = normalizeDocument({
    ...doc,
    updatedAt: new Date().toISOString(),
  });
  await kvSet(next);
  return next;
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

export function assertUniqueSlug(
  accounts: TrackedAccount[],
  slug: string,
  exceptSlug?: string,
): void {
  if (accounts.some((a) => a.slug === slug && a.slug !== exceptSlug)) {
    throw new Error(`slug 已存在：${slug}`);
  }
}

export function proposeSlug(name: string, custom?: string): string {
  const trimmed = custom?.trim();
  if (trimmed) return trimmed.replace(/=+$/, "");
  return slugifyAccount(name).replace(/=+$/, "");
}
