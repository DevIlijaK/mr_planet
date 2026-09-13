"use client";

import { useEffect, useState } from "react";

export interface Viewport {
  width: number;
  height: number;
}

/** 0×0 until mounted: the server has no window, and a level needs real numbers. */
const EMPTY: Viewport = { width: 0, height: 0 };

/**
 * The viewport, settled. Resize events are debounced because rebuilding the
 * level mid-drag (or on every mobile toolbar twitch) would throw the hero
 * around; a short pause is all it takes to make it feel deliberate.
 */
export function useViewport(delayMs = 120): Viewport {
  const [viewport, setViewport] = useState<Viewport>(EMPTY);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const measure = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight });

    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, delayMs);
    };

    measure();
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [delayMs]);

  return viewport;
}
