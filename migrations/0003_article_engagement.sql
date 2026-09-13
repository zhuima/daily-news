-- Optional WeChat engagement metrics (from wechatDownload export, not list-search)
ALTER TABLE articles ADD COLUMN read_count INTEGER;
ALTER TABLE articles ADD COLUMN like_count INTEGER;
ALTER TABLE articles ADD COLUMN old_like_count INTEGER;
ALTER TABLE articles ADD COLUMN comment_count INTEGER;
ALTER TABLE articles ADD COLUMN share_count INTEGER;
ALTER TABLE articles ADD COLUMN engagement_updated_at TEXT;
