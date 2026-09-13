import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  addTrackedAccount,
  listTrackedAccounts,
  removeTrackedAccount,
} from "@/lib/accounts-api";
import { readAccountsDocument } from "@/lib/accounts-store";
import { dbConfigured } from "@/lib/db/client";
import {
  adminTokenConfigured,
  verifyAdminRequest,
} from "@/lib/accounts-auth";

export async function GET() {
  const doc = await readAccountsDocument();
  const d1Bound = await dbConfigured();
  return NextResponse.json({
    accounts: doc.accounts,
    updatedAt: doc.updatedAt,
    persistence: d1Bound,
    d1Bound,
    adminConfigured: adminTokenConfigured(),
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  let body: {
    name?: string;
    slug?: string;
    notes?: string;
    addedAt?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "无效 JSON" }, { status: 400 });
  }

  try {
    if (!body.name?.trim()) {
      return NextResponse.json({ error: "缺少 name" }, { status: 400 });
    }
    const account = await addTrackedAccount({
      name: body.name,
      slug: body.slug,
      notes: body.notes,
      addedAt: body.addedAt,
    });
    const accounts = await listTrackedAccounts();
    return NextResponse.json({ account, accounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "添加失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const slug =
    request.nextUrl.searchParams.get("slug") ??
    (await request.json().catch(() => ({})) as { slug?: string }).slug;

  if (!slug) {
    return NextResponse.json({ error: "缺少 slug" }, { status: 400 });
  }

  try {
    await removeTrackedAccount(slug);
    const accounts = await listTrackedAccounts();
    return NextResponse.json({ ok: true, accounts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
