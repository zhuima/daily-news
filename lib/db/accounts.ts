import type { TrackedAccount } from "@/lib/accounts-types";
import type { TrackScanDb } from "@/lib/db/client";
import { slugifyAccount } from "@/lib/slug";
import type { AccountRow } from "@/lib/db/rows";

function rowToAccount(row: AccountRow): TrackedAccount {
  return {
    slug: row.slug,
    name: row.name,
    addedAt: row.added_at,
    notes: row.notes ?? "",
  };
}

export async function listAccountsFromDb(db: TrackScanDb): Promise<TrackedAccount[]> {
  const result = await db
    .prepare("SELECT * FROM accounts ORDER BY added_at DESC, name ASC")
    .all<AccountRow>();
  return (result.results ?? []).map(rowToAccount);
}

export async function getAccountBySlugFromDb(
  db: TrackScanDb,
  slug: string,
): Promise<TrackedAccount | undefined> {
  const row = await db
    .prepare("SELECT * FROM accounts WHERE slug = ?")
    .bind(slug)
    .first<AccountRow>();
  return row ? rowToAccount(row) : undefined;
}

export async function insertAccount(
  db: TrackScanDb,
  input: {
    name: string;
    slug: string;
    notes?: string;
    addedAt: string;
  },
): Promise<TrackedAccount> {
  await db
    .prepare(
      `INSERT INTO accounts (slug, name, added_at, notes) VALUES (?, ?, ?, ?)`,
    )
    .bind(
      input.slug,
      input.name,
      input.addedAt,
      input.notes?.trim() ?? "",
    )
    .run();
  return {
    slug: input.slug,
    name: input.name,
    addedAt: input.addedAt,
    notes: input.notes?.trim() ?? "",
  };
}

export async function deleteAccountBySlug(
  db: TrackScanDb,
  slug: string,
): Promise<boolean> {
  const result = await db
    .prepare("DELETE FROM accounts WHERE slug = ?")
    .bind(slug)
    .run();
  return (result.meta.changes ?? 0) > 0;
}

export function proposeSlug(name: string, custom?: string): string {
  const trimmed = custom?.trim();
  if (trimmed) return trimmed.replace(/=+$/, "");
  return slugifyAccount(name).replace(/=+$/, "");
}

export async function assertUniqueSlug(
  db: TrackScanDb,
  slug: string,
  exceptSlug?: string,
): Promise<void> {
  const row = await db
    .prepare("SELECT slug FROM accounts WHERE slug = ?")
    .bind(slug)
    .first<{ slug: string }>();
  if (row && row.slug !== exceptSlug) {
    throw new Error(`slug 已存在：${slug}`);
  }
}
