import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  adminTokenConfigured,
  verifyAdminToken,
} from "@/lib/accounts-auth";

export async function POST(request: NextRequest) {
  if (!adminTokenConfigured()) {
    return NextResponse.json(
      { error: "服务端未配置 ACCOUNTS_ADMIN_TOKEN" },
      { status: 503 },
    );
  }

  let token = "";
  try {
    const body = (await request.json()) as { token?: string };
    token = body.token?.trim() ?? "";
  } catch {
    return NextResponse.json({ error: "无效 JSON" }, { status: 400 });
  }

  if (!verifyAdminToken(token)) {
    return NextResponse.json({ error: "管理口令错误" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("accounts_admin", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("accounts_admin");
  return response;
}
