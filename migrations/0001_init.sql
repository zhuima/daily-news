-- Track Scan · Cloudflare D1 schema v1

CREATE TABLE IF NOT EXISTS accounts (
  slug TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  added_at TEXT NOT NULL,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_accounts_name ON accounts (name);

CREATE TABLE IF NOT EXISTS scans (
  id TEXT PRIMARY KEY NOT NULL,
  scan_date TEXT NOT NULL,
  title TEXT NOT NULL,
  sources_json TEXT NOT NULL DEFAULT '[]',
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_scans_date ON scans (scan_date DESC);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY NOT NULL,
  scan_id TEXT NOT NULL,
  scan_date TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT '',
  query TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  account TEXT NOT NULL,
  account_slug TEXT,
  published_label TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  has_direct_link INTEGER NOT NULL DEFAULT 0,
  source TEXT,
  FOREIGN KEY (scan_id) REFERENCES scans (id)
);

CREATE INDEX IF NOT EXISTS idx_articles_scan_id ON articles (scan_id);
CREATE INDEX IF NOT EXISTS idx_articles_scan_date ON articles (scan_date);
CREATE INDEX IF NOT EXISTS idx_articles_account ON articles (account);
CREATE INDEX IF NOT EXISTS idx_articles_account_slug ON articles (account_slug);
CREATE INDEX IF NOT EXISTS idx_articles_title ON articles (title);
CREATE INDEX IF NOT EXISTS idx_articles_url ON articles (url);

CREATE TABLE IF NOT EXISTS catalog_meta (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL
);
