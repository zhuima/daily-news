"use client";

import Waves from "@/components/Waves";
import { useMotionAllowed } from "@/hooks/use-motion-allowed";
import { useThemeColor } from "@/hooks/use-theme-color";

export function HomeIntroBackdrop() {
  const motionOn = useMotionAllowed();
  const lineColor = useThemeColor("--marrs", "#01847E");

  if (!motionOn) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.11]"
      aria-hidden
    >
      <Waves
        lineColor={lineColor}
        backgroundColor="transparent"
        waveSpeedX={0.007}
        waveSpeedY={0.003}
        waveAmpX={16}
        waveAmpY={7}
        xGap={20}
        yGap={42}
        maxCursorMove={24}
      />
    </div>
  );
}
