import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ScanWorkspace } from "@/components/ScanWorkspace";
import { publishedDateTime, resolveArticleLink } from "@/lib/articles";
import {
  getArticle,
  getArticlesByScan,
  getQueriesForScan,
  getScan,
} from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

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
  const path = selected
    ? `/scans/${scanId}?article=${encodeURIComponent(selected.id)}`
    : `/scans/${scanId}`;

  return buildPageMetadata({
    title: selected ? selected.title : scan.title,
    description: selected
      ? `${selected.account} · ${selected.publishedLabel} · ${selected.summary.slice(0, 120)}`
      : `${scan.title} · ${scan.articleCount} 篇文章归档`,
    path,
    type: selected ? "article" : "website",
  });
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
  const siteUrl = getSiteUrl();
  const scanUrl = absoluteUrl(`/scans/${scanId}`);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "首页",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: scan.title,
          item: scanUrl,
        },
      ],
    },
    {
      "@type": "CollectionPage",
      "@id": `${scanUrl}#collection`,
      name: scan.title,
      description: scan.notes ?? scan.title,
      url: scanUrl,
      datePublished: `${scan.date}T08:00:00+08:00`,
      numberOfItems: articles.length,
    },
  ];

  if (selectedArticle) {
    const link = resolveArticleLink(selectedArticle);
    graph.push({
      "@type": "NewsArticle",
      headline: selectedArticle.title,
      description: selectedArticle.summary,
      author: {
        "@type": "Organization",
        name: selectedArticle.account,
      },
      datePublished: publishedDateTime(selectedArticle),
      url: link?.href ?? absoluteUrl(`/scans/${scanId}?article=${selectedArticle.id}`),
      isAccessibleForFree: true,
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
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
