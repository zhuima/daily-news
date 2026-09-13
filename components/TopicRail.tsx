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
      <h2 className="text-[13px] font-medium text-marrs">检索词</h2>
      <ul className="mt-4 divide-y divide-line">
        {topics.map((topic) => (
          <li key={topic.query}>
            {scanId ? (
              <Link
                href={`/scans/${scanId}?q=${encodeURIComponent(topic.query)}`}
                className="interactive focus-ring flex items-center justify-between gap-3 py-2.5 text-sm text-ink hover:text-marrs"
              >
                <span className="line-clamp-1">{topic.query}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted">
                  {topic.count}
                </span>
              </Link>
            ) : (
              <span className="flex items-center justify-between gap-3 py-2.5 text-sm text-ink">
                <span className="line-clamp-1">{topic.query}</span>
                <span className="text-xs tabular-nums text-muted">{topic.count}</span>
              </span>
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}
