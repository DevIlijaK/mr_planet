"use client";

import Image from "next/image";
import { type FC } from "react";
import { type LevelPlatform } from "~/lib/level";
import { planetFor } from "./planets";

interface PlatformProps {
  platform: LevelPlatform;
  ledgeHeight: number;
  headroom: number;
  /** How far the sign may spill past the ledge on its open side. */
  overhang: number;
  active: boolean;
}

/**
 * One blog post, as a chunk of rock the hero can land on. The ledge is the
 * collision surface; the planet stands on it at one end and the sign hangs
 * off it toward the open side, the way a level would label a checkpoint.
 */
export const Platform: FC<PlatformProps> = ({
  platform,
  ledgeHeight,
  headroom,
  overhang,
  active,
}) => {
  const { post, x, y, width, align, id } = platform;
  const planetSize = Math.round(headroom * 0.55);
  const left = align === "left";

  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y - headroom,
        width,
        height: headroom + ledgeHeight,
      }}
    >
      <div
        className={`absolute flex items-end gap-2 ${
          left ? "left-0 flex-row" : "right-0 flex-row-reverse text-right"
        }`}
        style={{ bottom: ledgeHeight, width: width + overhang }}
      >
        <Image
          src={planetFor(id)}
          alt=""
          aria-hidden
          sizes={`${planetSize}px`}
          className={`shrink-0 object-contain ${post ? "" : "opacity-40 grayscale"}`}
          style={{
            width: planetSize,
            height: planetSize,
            // Standing on the crust rather than floating above it.
            marginBottom: -3,
            marginLeft: left ? 10 : 0,
            marginRight: left ? 0 : 10,
          }}
        />

        <div className="signage min-w-0 flex-1 pb-2">
          {post ? (
            <>
              <h2 className="sign-copy line-clamp-2 text-[15px] font-semibold leading-[1.2] tracking-[-0.01em] text-[color:var(--crust)] sm:text-[17px]">
                {post.title}
              </h2>
              <p className="sign-copy mt-1 line-clamp-2 text-[12px] leading-snug text-[color:var(--dust)]">
                {post.excerpt}
              </p>
              <p className="mt-1 font-pixel text-[11px] uppercase tracking-wide text-[color:var(--crust-shade)]">
                {post.readingMinutes} min read
              </p>
            </>
          ) : (
            <>
              <h2 className="sign-copy text-[15px] font-semibold leading-[1.2] text-[color:var(--crust-shade)] sm:text-[17px]">
                Coming soon
              </h2>
              <p className="sign-copy mt-1 text-[12px] leading-snug text-[color:var(--dust)] opacity-70">
                Nothing in this orbit yet.
              </p>
            </>
          )}
        </div>
      </div>

      <div
        className={`terrain terrain-ledge absolute bottom-0 left-0 w-full ${
          active ? "terrain-ledge-active" : ""
        } ${post ? "" : "terrain-ledge-filler"}`}
        style={{ height: ledgeHeight }}
      />
    </div>
  );
};
