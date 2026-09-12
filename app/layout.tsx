import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, Geist } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  getSiteUrl,
} from "@/lib/site";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans-stack",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-display-stack",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif-stack",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} · daily-news`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  manifest: "/manifest.webmanifest",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} RSS` }],
    },
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#01847E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const siteUrl = getSiteUrl();
  return (
    <html
      lang="zh-CN"
      className={`${geist.variable} ${newsreader.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <a href="#main-content" className="skip-link">
          跳到主要内容
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `${siteUrl}/#website`,
                url: siteUrl,
                name: SITE_NAME,
                description: SITE_DESCRIPTION,
                inLanguage: "zh-CN",
                publisher: { "@id": `${siteUrl}/#organization` },
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${siteUrl}/#site-search`,
                  },
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                "@id": `${siteUrl}/#organization`,
                name: SITE_NAME,
                url: siteUrl,
                description: SITE_TAGLINE,
              },
            ],
          }}
        />
        <SiteHeader />
        <div id="main-content" className="flex flex-1 flex-col">
          {children}
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
