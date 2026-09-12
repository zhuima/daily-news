import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let body: { url?: string } = {};
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    /* empty */
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "正文抓取不在 Vercel 上运行。请在本地克隆 https://github.com/zhuima/x-fetcher 并执行 fetch_wechat.py，或使用 node scripts/download-account-bodies.mjs --account \"公众号名\"。",
      receivedUrl: body.url ?? null,
      docs: "https://github.com/zhuima/x-fetcher",
    },
    { status: 501 },
  );
}
