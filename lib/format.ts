const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Shanghai",
});

export function formatScanDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return dateFormatter.format(new Date(Date.UTC(year, month - 1, day, 4)));
}

export function sourceLabel(sources: string[]): string {
  return sources.join(" · ");
}
