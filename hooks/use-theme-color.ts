"use client";

import { useEffect, useState } from "react";

/** Resolve a CSS custom property after mount. Fallback is never shown as UI copy. */
export function useThemeColor(variable: string, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    if (value) setColor(value);
  }, [variable]);

  return color;
}
