import Link from "next/link";

export function TopicRail({
  topics,
  scanId,
}: {
  topics: { query: string; count: number }[];
  scanId?: string;
}) {
  return (
    <aside>
      <h2 className="text-[13px] font-medium text-ink">检索词</h2>
      <ul className="mt-3 space-y-1">
        {topics.map((topic) => (
          <li key={topic.query}>
            {scanId ? (
              <Link
                href={`/scans/${scanId}?q=${encodeURIComponent(topic.query)}`}
                className="focus-ring flex items-center justify-between gap-3 py-1 text-[13px] text-muted hover:text-marrs"
              >
                <span className="line-clamp-1">{topic.query}</span>
                <span className="shrink-0 tabular-nums">{topic.count}</span>
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-3 py-1 text-[13px] text-muted">
                <span className="line-clamp-1">{topic.query}</span>
                <span className="tabular-nums">{topic.count}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
