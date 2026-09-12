import type { MetadataRoute } from "next";
import { getAllArticles, getScans, getTrackedAccounts } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
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

  for (const scan of getScans()) {
    entries.push({
      url: absoluteUrl(`/scans/${scan.id}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
    for (const article of getAllArticles().filter(
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

  for (const account of getTrackedAccounts()) {
    entries.push({
      url: absoluteUrl(`/accounts/${account.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    });
  }

  return entries;
}
