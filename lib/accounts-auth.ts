import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export function adminTokenConfigured(): boolean {
  return Boolean(process.env.ACCOUNTS_ADMIN_TOKEN?.trim());
}

export function verifyAdminToken(token: string | null | undefined): boolean {
  const expected = process.env.ACCOUNTS_ADMIN_TOKEN?.trim();
  if (!expected) return false;
  return Boolean(token && token === expected);
}

export async function verifyAdminFromCookies(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get("accounts_admin")?.value);
}

export function verifyAdminRequest(request: NextRequest): boolean {
  const expected = process.env.ACCOUNTS_ADMIN_TOKEN?.trim();
  if (!expected) return false;

  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return auth.slice("Bearer ".length) === expected;
  }
  const header = request.headers.get("x-accounts-admin-token");
  if (header === expected) return true;
  const cookie = request.cookies.get("accounts_admin")?.value;
  return cookie === expected;
}
