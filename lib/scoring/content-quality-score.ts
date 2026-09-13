/**
 * 文章质量分（0–100）· 基于内容本身，非赛道选题、非流量、非链接权重。
 *
 * substance(35) + clarity(25) + evidence(25) + originality(15)
 * 无正文时仅用 title+summary，理由中标注「仅据标题摘要」并略降置信。
 * 链接/新鲜度仅可在 scoreReason 中作 tie-break 说明，不计入主分权重。
 */

export const SCORE_WEIGHTS = {
  substance: 35,
  clarity: 25,
  evidence: 25,
  originality: 15,
} as const;

export type ScoreInput = {
  title: string;
  summary: string;
  query?: string;
  url?: string;
  publishedLabel?: string;
  hasDirectLink?: boolean;
  /** 正文全文（若已抓取）；无则仅标题+摘要 */
  body?: string;
};

export type ContentQualityScore = {
  score: number;
  scoreReason: string;
  breakdown: {
    substance: number;
    clarity: number;
    evidence: number;
    originality: number;
  };
  metaOnly: boolean;
};

function corpus(input: ScoreInput): string {
  const chunks = [input.title, input.summary];
  if (input.body?.trim()) chunks.push(input.body.trim());
  return chunks.join("\n");
}

function countMatches(text: string, patterns: RegExp[]): number {
  let n = 0;
  for (const re of patterns) {
    if (re.test(text)) n += 1;
  }
  return n;
}

function scoreSubstance(text: string, summary: string): number {
  let raw = 8;
  const len = summary.trim().length;
  if (len >= 120) raw += 10;
  else if (len >= 60) raw += 5;
  else if (len < 35) raw -= 8;

  raw += countMatches(text, [
    /\d+(\.\d+)?%?/,
    /机制|原理|架构|流程|模块|层次|栈/,
    /权衡|trade[- ]?off|取舍|瓶颈/,
    /对比|差异|边界|场景/,
  ]) * 3;

  raw -= countMatches(text, [
    /震惊|必看|99%|爆款|速览|一文读懂/,
    /点击|关注|转发/,
  ]) * 4;

  if (/盘点|合集|精选\d+/.test(text) && len < 100) raw -= 6;

  return Math.max(0, Math.min(SCORE_WEIGHTS.substance, Math.round(raw)));
}

function scoreClarity(text: string, summary: string): number {
  let raw = 6;
  const sentences = summary.split(/[。！？.!?]/).filter((s) => s.trim().length > 4);
  if (sentences.length >= 3) raw += 8;
  else if (sentences.length >= 2) raw += 4;

  raw += countMatches(text, [
    /首先|其次|最后|一方面|另一方面/,
    /一是|二是|三是/,
    /：[^：]{8,}/,
  ]) * 3;

  raw -= countMatches(text, [/！{2,}/, /[A-Z]{8,}/, /……{2,}/]) * 3;

  if (summary.length > 400 && sentences.length < 2) raw -= 8;

  return Math.max(0, Math.min(SCORE_WEIGHTS.clarity, Math.round(raw)));
}

function scoreEvidence(text: string): number {
  let raw = 4;
  raw += countMatches(text, [
    /数据|样本|实验|测试|测得|基准|benchmark/i,
    /来源|引用|论文|报告|白皮书/,
    /复现|可复现|步骤|配置|命令/,
    /表\d|图\d|p99|p95|ms|gb|tb/i,
  ]) * 4;

  raw -= countMatches(text, [
    /据悉(?!.*数据)/,
    /网传(?!.*测试)/,
    /有人说|业内认为(?!.*数据)/,
  ]) * 3;

  return Math.max(0, Math.min(SCORE_WEIGHTS.evidence, Math.round(raw)));
}

function scoreOriginality(text: string): number {
  let raw = 6;
  raw += countMatches(text, [
    /我们(认为|发现|测|试)/,
    /实测|亲测|对比实验|实验结果/,
    /结论|推断|因此|这意味着/,
    /原创|梳理.*逻辑/,
  ]) * 3;

  raw -= countMatches(text, [
    /转载|转自|整理自|摘自|来源：/,
    /快讯|速递|早报|晚报/,
    /通稿|发布会摘要/,
    /seo|洗稿/i,
  ]) * 4;

  return Math.max(0, Math.min(SCORE_WEIGHTS.originality, Math.round(raw)));
}

function buildReason(
  breakdown: ContentQualityScore["breakdown"],
  metaOnly: boolean,
  input: ScoreInput,
): string {
  const ranked = [
    ["深度", breakdown.substance] as [string, number],
    ["结构", breakdown.clarity] as [string, number],
    ["论据", breakdown.evidence] as [string, number],
    ["原创", breakdown.originality] as [string, number],
  ].sort((a, b) => b[1] - a[1]);

  let reason = `${ranked[0][0]}${ranked[0][1]}`;
  if (ranked[1][1] >= 10 && reason.length < 18) {
    reason += `·${ranked[1][0]}`;
  }
  if (metaOnly) {
    reason += "·仅据标题摘要";
  } else if (
    input.hasDirectLink &&
    input.url?.includes("mp.weixin.qq.com") &&
    reason.length < 28
  ) {
    reason += "·可阅原文";
  }
  return reason.slice(0, 40);
}

export function scoreArticleQuality(input: ScoreInput): ContentQualityScore {
  const metaOnly = !input.body?.trim();
  const text = corpus(input);
  const summary = input.summary ?? "";

  let breakdown = {
    substance: scoreSubstance(text, summary),
    clarity: scoreClarity(text, summary),
    evidence: scoreEvidence(text),
    originality: scoreOriginality(text),
  };

  let total =
    breakdown.substance +
    breakdown.clarity +
    breakdown.evidence +
    breakdown.originality;

  if (metaOnly) {
    total = Math.round(total * 0.88);
    breakdown = {
      substance: Math.min(breakdown.substance, SCORE_WEIGHTS.substance - 2),
      clarity: breakdown.clarity,
      evidence: Math.min(breakdown.evidence, SCORE_WEIGHTS.evidence - 3),
      originality: breakdown.originality,
    };
    total = Math.min(
      total,
      breakdown.substance +
        breakdown.clarity +
        breakdown.evidence +
        breakdown.originality,
    );
  }

  const score = Math.max(0, Math.min(100, total));
  const scoreReason = buildReason(breakdown, metaOnly, input);

  return { score, scoreReason, breakdown, metaOnly };
}

/** @deprecated 使用 scoreArticleQuality */
export function scoreArticleForNiche(input: ScoreInput): ContentQualityScore {
  return scoreArticleQuality(input);
}
