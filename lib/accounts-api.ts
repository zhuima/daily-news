import type { TrackedAccount } from "@/lib/accounts-types";
import {
  assertUniqueSlug,
  proposeSlug,
  readAccountsDocument,
  writeAccountsDocument,
} from "@/lib/accounts-store";

export async function listTrackedAccounts(): Promise<TrackedAccount[]> {
  const doc = await readAccountsDocument();
  return doc.accounts;
}

export async function getTrackedAccountBySlug(
  slug: string,
): Promise<TrackedAccount | undefined> {
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

  const doc = await readAccountsDocument();
  const slug = proposeSlug(name, input.slug);
  assertUniqueSlug(doc.accounts, slug);

  const account: TrackedAccount = {
    slug,
    name,
    notes: input.notes?.trim() || "",
    addedAt: input.addedAt?.trim() || new Date().toISOString(),
  };

  await writeAccountsDocument({
    ...doc,
    accounts: [...doc.accounts, account],
  });

  return account;
}

export async function removeTrackedAccount(slug: string): Promise<void> {
  const doc = await readAccountsDocument();
  const next = doc.accounts.filter((account) => account.slug !== slug);
  if (next.length === doc.accounts.length) {
    throw new Error("未找到该 slug");
  }
  await writeAccountsDocument({ ...doc, accounts: next });
}
