/** 解析导出 CSV/JSON 中的阅读、点赞等数字；0 或无效 → undefined（不造假） */
export function parseCountValue(raw: unknown): number | undefined {
  if (raw == null) return undefined;
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || raw <= 0) return undefined;
    return Math.round(raw);
  }
  const s = String(raw).trim().replace(/,/g, "").replace(/\s+/g, "");
  if (!s || s === "0" || s === "-" || s === "—") return undefined;

  const wan = /^([\d.]+)万$/.exec(s);
  if (wan) {
    const v = Math.round(parseFloat(wan[1]) * 10000);
    return v > 0 ? v : undefined;
  }

  const digits = /^(\d+)$/.exec(s);
  if (digits) {
    const v = parseInt(digits[1], 10);
    return v > 0 ? v : undefined;
  }
  return undefined;
}
