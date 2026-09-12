import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/site";

export function buildPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path,
  type = "website",
}: {
  title: string;
  description?: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "zh_CN",
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    metadataBase: new URL(getSiteUrl()),
  };
}

export function jsonLdScript(data: Record<string, unknown> | Record<string, unknown>[]) {
  return {
    __html: JSON.stringify(data),
  };
}
