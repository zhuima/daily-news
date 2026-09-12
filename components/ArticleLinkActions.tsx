import { resolveArticleLink } from "@/lib/articles";
import type { Article } from "@/lib/types";

export function ArticleLinkActions({
  article,
  compact = false,
}: {
  article: Article;
  compact?: boolean;
}) {
  const link = resolveArticleLink(article);

  return (
    <div className={compact ? "" : "mt-8 border-t border-line pt-6"}>
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center rounded-sm bg-marrs px-5 text-sm text-white transition-colors hover:bg-marrs-deep"
      >
        {link.label}
      </a>
      {link.kind === "mp-direct" ? (
        <p className="mt-3 break-all text-xs text-muted">{link.href}</p>
      ) : (
        <p className="mt-3 text-sm leading-6 text-muted">{link.hint}</p>
      )}
    </div>
  );
}
