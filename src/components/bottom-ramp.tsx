"use client";

import { useCallback } from "react";
import { useSpace } from "./providers/space-provider";

/** The ground: the same rock as the ledges, running the full width. */
export const BottomRamp = () => {
  const { registerRamp } = useSpace();

  const rampRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) return registerRamp(element);
    },
    [registerRamp],
  );

  // `data-floor` marks this as the ground rather than a blog, so the hero
  // doesn't offer to teleport into it.
  return (
    <div ref={rampRef} data-floor="true" className="terrain h-[10dvh] w-full" />
  );
};
