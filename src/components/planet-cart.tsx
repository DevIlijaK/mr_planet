"use client";

import Image, { type StaticImageData } from "next/image";
import React, { useCallback } from "react";
import { useSpace } from "./providers/space-provider";
import { getTeaser, getTitle, pickIndex } from "~/lib/blog-preview";

interface PlanetCartProps {
  id: string;
  planet: StaticImageData;
  content: string;
}

/** Ledge widths, as a share of the column. Uneven lengths and offsets are what
 *  make a row of platforms read as a level rather than a list of shelves. */
const SPANS = [72, 100, 84, 62, 92, 76];

/**
 * One blog post, as a chunk of rock the hero can land on. The ledge across the
 * bottom is the collision surface; the world and its signage sit on top of it.
 */
export const PlanetCart: React.FC<PlanetCartProps> = ({
  id,
  planet,
  content,
}) => {
  const { registerRamp } = useSpace();

  // A callback ref so the ledge unregisters itself when the card unmounts,
  // instead of leaving a detached node in the collision list.
  const rampRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) return registerRamp(element);
    },
    [registerRamp],
  );

  // Derived from the post id so a platform keeps its shape between renders.
  const span = SPANS[pickIndex(id, SPANS.length)]!;
  const alignRight = pickIndex(`${id}~`, 2) === 1;

  return (
    <div className="flex h-[25dvh] w-full flex-col justify-end">
      <div className="signage pb-2">
        {/* my-0 defeats the global heading margins, which are meant for the
            article page and blow this composition apart. */}
        <h2 className="my-0 line-clamp-2 font-pixel text-[17px] font-medium leading-tight text-[color:var(--crust)]">
          {getTitle(content)}
        </h2>
        <p className="mt-1 line-clamp-2 max-w-[46ch] text-[11px] leading-snug text-[color:var(--dust)]">
          {getTeaser(content)}
        </p>
      </div>

      <div
        className={alignRight ? "self-end" : "self-start"}
        style={{ width: `${span}%` }}
      >
        {/* Standing on the crust rather than floating beside it, so the ledge
            reads as ground with a world on it. */}
        <div
          className={`flex px-3 ${alignRight ? "justify-end" : "justify-start"}`}
        >
          <Image
            src={planet}
            alt=""
            aria-hidden
            sizes="9dvh"
            className="-mb-[3px] h-[9dvh] w-[9dvh] object-contain"
          />
        </div>

        <div ref={rampRef} className="terrain terrain-ledge h-[6dvh] w-full" />
      </div>
    </div>
  );
};
