"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useMotionAllowed } from "@/hooks/use-motion-allowed";

type HeadlineMotion = ComponentType<{
  id?: string;
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: Record<string, number>;
  to?: Record<string, number>;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: "left" | "center" | "right";
}>;

export function HomeHeadline({
  id,
  text,
  className,
}: {
  id: string;
  text: string;
  className?: string;
}) {
  const motionOn = useMotionAllowed();
  const [SplitText, setSplitText] = useState<HeadlineMotion | null>(null);

  useEffect(() => {
    if (!motionOn) return;
    let cancelled = false;
    import("@/components/SplitText")
      .then((mod) => {
        if (!cancelled) setSplitText(() => mod.default);
      })
      .catch(() => {
        /* keep the static H1 */
      });
    return () => {
      cancelled = true;
    };
  }, [motionOn]);

  if (!motionOn || !SplitText) {
    return (
      <h1 id={id} className={className}>
        {text}
      </h1>
    );
  }

  return (
    <SplitText
      id={id}
      tag="h1"
      text={text}
      className={className}
      textAlign="left"
      delay={36}
      duration={0.55}
      ease="power2.out"
      splitType="chars"
      from={{ opacity: 0.55, y: 8 }}
      to={{ opacity: 1, y: 0 }}
      threshold={0.2}
      rootMargin="0px"
    />
  );
}
