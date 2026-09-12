import Link from "next/link";

export function TopicRail({
  topics,
  scanId,
}: {
  topics: { query: string; count: number }[];
  scanId?: string;
}) {
  return (
    <aside className="rounded-sm bg-paper p-6 ring-1 ring-line">
      <h2 className="font-display text-xs tracking-[0.18em] text-marrs uppercase">
        检索词索引
      </h2>
      <ul className="mt-4 space-y-2">
        {topics.map((topic) => (
          <li key={topic.query}>
            {scanId ? (
              <Link
                href={`/scans/${scanId}?q=${encodeURIComponent(topic.query)}`}
                className="flex items-center justify-between gap-3 text-sm text-ink hover:text-marrs"
              >
                <span className="line-clamp-1">{topic.query}</span>
                <span className="shrink-0 text-xs text-muted">{topic.count}</span>
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-3 text-sm text-ink">
                <span className="line-clamp-1">{topic.query}</span>
                <span className="text-xs text-muted">{topic.count}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
