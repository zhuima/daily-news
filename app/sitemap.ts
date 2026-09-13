import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";
import { listTrackedAccounts } from "@/lib/accounts-api";
import { getAllArticles, getScans } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: absoluteUrl("/accounts"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/llms.txt"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  for (const scan of await getScans()) {
    entries.push({
      url: absoluteUrl(`/scans/${scan.id}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    for (const article of (await getAllArticles()).filter(
      (item) => item.scanDate === scan.date,
    )) {
      entries.push({
        url: absoluteUrl(
          `/scans/${scan.id}?article=${encodeURIComponent(article.id)}`,
        ),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  }

  const accounts = await listTrackedAccounts();
  for (const account of accounts) {
    entries.push({
      url: absoluteUrl(`/accounts/${account.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return entries;
}
