import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAdminRequest } from "@/lib/accounts-auth";
import { getDb } from "@/lib/db/client";
import { importArticleLinks } from "@/lib/db/import-service";
import {
  parseWechatExportCsv,
  parseWechatExportJson,
} from "@/lib/import-wechat-export";

export async function POST(request: NextRequest) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const db = await getDb();
  if (!db) {
    return NextResponse.json(
      { error: "D1 未绑定。请在 Cloudflare / wrangler dev 下导入。" },
      { status: 503 },
    );
  }

  const contentType = request.headers.get("content-type") ?? "";
  let scanId =
    request.nextUrl.searchParams.get("scanId")?.trim() ?? "";
  let rows;

  try {
    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      scanId = (form.get("scanId") as string)?.trim() || scanId;
      const file = form.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "缺少 file 字段" }, { status: 400 });
      }
      const text = await file.text();
      const name = "name" in file ? String(file.name) : "";
      if (name.endsWith(".csv") || text.trimStart().startsWith("title,")) {
        rows = parseWechatExportCsv(text);
      } else {
        rows = parseWechatExportJson(JSON.parse(text));
      }
    } else {
      const body = (await request.json()) as {
        scanId?: string;
        format?: "json" | "csv";
        payload?: unknown;
        text?: string;
      };
      scanId = body.scanId?.trim() || scanId;
      if (body.format === "csv" && typeof body.text === "string") {
        rows = parseWechatExportCsv(body.text);
      } else if (body.payload !== undefined) {
        rows = parseWechatExportJson(body.payload);
      } else {
        return NextResponse.json({ error: "无效请求体" }, { status: 400 });
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "解析失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (!scanId) {
    return NextResponse.json({ error: "缺少 scanId" }, { status: 400 });
  }

  try {
    const result = await importArticleLinks(db, scanId, rows);
    return NextResponse.json({
      ok: true,
      ...result,
      imported: result.matched + result.inserted,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "导入失败";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
