import { resolveArticleLink } from "@/lib/articles";
import type { Article } from "@/lib/types";

const labels = {
  inline: "查看原文 →",
  compact: "原文 →",
} as const;

export function OriginalArticleLink({
  article,
  variant = "inline",
  className = "",
}: {
  article: Article;
  variant?: keyof typeof labels;
  className?: string;
}) {
  const link = resolveArticleLink(article);
  if (!link) {
    return (
      <span className={`text-sm text-muted ${className}`}>原文链接待收录</span>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`打开原文：${article.title}`}
      className={`inline-flex items-center gap-1 text-sm font-medium text-marrs hover:text-marrs-deep hover:underline ${className}`}
    >
      {labels[variant]}
      <span className="sr-only">（在新标签页打开）</span>
    </a>
  );
}
