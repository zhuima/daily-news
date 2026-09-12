export type Scan = {
  id: string;
  date: string;
  title: string;
  sources: string[];
  articleCount: number;
  notes?: string;
};

export type Article = {
  id: string;
  scanDate: string;
  channel: string;
  query: string;
  title: string;
  account: string;
  publishedLabel: string;
  summary: string;
  url: string;
  hasDirectLink: boolean;
};

export type Catalog = {
  version: string;
  updatedAt: string;
  scans: Scan[];
  articles: Article[];
};
