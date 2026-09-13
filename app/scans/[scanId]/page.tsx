import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { ScanWorkspace } from "@/components/ScanWorkspace";
import {
  isAllowedArticleUrl,
  publishedDateTime,
  resolveArticleLink,
} from "@/lib/articles";
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

function readQueryParam(q: string | string[] | undefined): string {
  if (Array.isArray(q)) return q[0] ?? "";
  return q ?? "";
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/scans/[scanId]">): Promise<Metadata> {
  const { scanId } = await params;
  const scan = await getScan(scanId);
  if (!scan) return { title: "未找到扫描" };

  const { article } = await searchParams;
  const selected = await getArticle(readArticleId(article));
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
  const scan = await getScan(scanId);
  if (!scan) notFound();

  const { article, q } = await searchParams;
  const selectedId = readArticleId(article);
  const initialQuery = readQueryParam(q);
  const articles = await getArticlesByScan(scanId);
  const selectedArticle = await getArticle(selectedId);
  const siteUrl = getSiteUrl();
  const scanUrl = absoluteUrl(`/scans/${scanId}`);
  const linkedCount = articles.filter((a) => isAllowedArticleUrl(a.url)).length;

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
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: articles.length,
        itemListElement: articles.slice(0, 30).map((a, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: a.title,
          url: absoluteUrl(
            `/scans/${scanId}?article=${encodeURIComponent(a.id)}`,
          ),
        })),
      },
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
      url:
        link?.href ??
        absoluteUrl(`/scans/${scanId}?article=${selectedArticle.id}`),
      isAccessibleForFree: true,
      publisher: { "@id": `${siteUrl}/#organization` },
    });
  }

  return (
    <main className="flex flex-1 flex-col">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": graph }} />
      <div className="editorial-container pt-6 pb-2">
        <Breadcrumbs
          items={[
            { label: "首页", href: "/" },
            { label: "扫描", href: "/#scans" },
            { label: scan.title },
          ]}
        />
        <p className="mt-3 text-xs text-muted">
          {scan.date} · {articles.length} 篇 · {linkedCount} 条可开原文
        </p>
      </div>
      <ScanWorkspace
        scan={scan}
        articles={articles}
        queries={await getQueriesForScan(scanId)}
        selectedId={selectedId}
        selectedArticle={selectedArticle}
        initialQuery={initialQuery}
      />
    </main>
  );
}
