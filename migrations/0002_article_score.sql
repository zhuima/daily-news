-- Article content quality score (质量分)
ALTER TABLE articles ADD COLUMN score INTEGER;
ALTER TABLE articles ADD COLUMN score_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_articles_score ON articles (score DESC);
