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
  /** 内容质量分 0–100（非流量、非选题权重） */
  score?: number;
  scoreReason?: string;
};

export type Catalog = {
  version: string;
  updatedAt: string;
  scans: Scan[];
  articles: Article[];
};
