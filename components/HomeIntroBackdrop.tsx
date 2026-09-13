"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useMotionAllowed } from "@/hooks/use-motion-allowed";
import { useThemeColor } from "@/hooks/use-theme-color";

type WavesProps = {
  lineColor?: string;
  backgroundColor?: string;
  waveSpeedX?: number;
  waveSpeedY?: number;
  waveAmpX?: number;
  waveAmpY?: number;
  xGap?: number;
  yGap?: number;
  maxCursorMove?: number;
};

export function HomeIntroBackdrop() {
  const motionOn = useMotionAllowed();
  const lineColor = useThemeColor("--marrs", "#01847E");
  const [Waves, setWaves] = useState<ComponentType<WavesProps> | null>(null);

  useEffect(() => {
    if (!motionOn) return;
    let cancelled = false;
    import("@/components/Waves")
      .then((mod) => {
        if (!cancelled) setWaves(() => mod.default);
      })
      .catch(() => {
        /* intro stays a quiet canvas */
      });
    return () => {
      cancelled = true;
    };
  }, [motionOn]);

  if (!motionOn || !Waves) return null;

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
