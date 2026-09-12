import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ScanWorkspace } from "@/components/ScanWorkspace";
import {
  getArticle,
  getArticlesByScan,
  getQueriesForScan,
  getScan,
} from "@/lib/data";

function readArticleId(
  article: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(article)) return article[0];
  return article;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/scans/[scanId]">): Promise<Metadata> {
  const { scanId } = await params;
  const scan = getScan(scanId);
  if (!scan) return { title: "未找到扫描" };

  const { article } = await searchParams;
  const selected = getArticle(readArticleId(article));
  return {
    title: selected ? `${selected.title} · ${scan.title}` : scan.title,
  };
}

export default async function ScanPage({
  params,
  searchParams,
}: PageProps<"/scans/[scanId]">) {
  const { scanId } = await params;
  const scan = getScan(scanId);
  if (!scan) notFound();

  const { article } = await searchParams;
  const selectedId = readArticleId(article);
  const articles = getArticlesByScan(scanId);
  const selectedArticle = getArticle(selectedId);

  return (
    <main className="flex flex-1 flex-col">
      <ScanWorkspace
        scan={scan}
        articles={articles}
        queries={getQueriesForScan(scanId)}
        selectedId={selectedId}
        selectedArticle={selectedArticle}
      />
    </main>
  );
}
