"use client";

import type { ReactNode } from "react";
import GlareHover from "@/components/GlareHover";
import { useMotionAllowed } from "@/hooks/use-motion-allowed";
import { useThemeColor } from "@/hooks/use-theme-color";

export function SoftCardHover({ children }: { children: ReactNode }) {
  const motionOn = useMotionAllowed();
  const glareColor = useThemeColor("--marrs", "#01847E");

  if (!motionOn) {
    return (
      <div
        className="mb-2 overflow-hidden bg-paper"
        style={{
          borderRadius: "var(--radius-outer)",
          boxShadow: "var(--shadow-marrs)",
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <GlareHover
      width="100%"
      height="auto"
      background="transparent"
      borderColor="transparent"
      borderRadius="var(--radius-outer)"
      glareColor={glareColor}
      glareOpacity={0.14}
      glareSize={180}
      transitionDuration={720}
      className="mb-2 border-transparent [place-items:stretch] shadow-[var(--shadow-marrs)]"
    >
      {children}
    </GlareHover>
  );
}
