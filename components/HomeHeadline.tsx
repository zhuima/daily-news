"use client";

import SplitText from "@/components/SplitText";
import { useMotionAllowed } from "@/hooks/use-motion-allowed";

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

  if (!motionOn) {
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
