"use client";

import { type FC, useRef } from "react";
import { type LevelPost } from "~/lib/level";
import { useGameLoop } from "./providers/game-loop-context";

interface HudProps {
  postCount: number;
  /** The post under the hero's feet, if he is standing on one. */
  post: LevelPost | null;
}

/** Everything pinned to the screen rather than the world. */
export const Hud: FC<HudProps> = ({ postCount, post }) => {
  const { hasMoreAbove, phase, teleport } = useGameLoop();
  const canRead = post !== null && phase === "playing";

  // The post is gone the frame he jumps, but the button takes 200ms to fade.
  // Keep naming the last post so it never reads as a blank "Read" on the way out.
  const lastPost = useRef<LevelPost | null>(null);
  if (post) lastPost.current = post;
  const shown = post ?? lastPost.current;

  return (
    <>
      <header className="pointer-events-none absolute left-4 top-3 z-20 sm:left-6 sm:top-5">
        <h1 className="signage font-pixel text-[22px] font-bold leading-none tracking-wide text-[color:var(--crust)] sm:text-[28px]">
          MR. PLANET
        </h1>
        <p className="signage mt-1 font-pixel text-[12px] leading-none text-[color:var(--dust)] sm:text-[13px]">
          {postCount} posts by{" "}
          <a
            href="https://ilijakosanin.dev"
            className="pointer-events-auto text-[color:var(--signal)] no-underline hover:underline"
          >
            Ilija Košanin
          </a>
          . Jump to one.
        </p>
      </header>

      <div
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2 transition-opacity duration-300 sm:top-5 ${
          hasMoreAbove ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="hud-prompt hud-bob flex items-center gap-2 whitespace-nowrap px-2 py-1 font-pixel text-[12px] leading-none">
          <span aria-hidden>▲</span>
          <span>More posts up there</span>
        </div>
      </div>

      {/* The call to action sits in the HUD, not over the hero, so it never
          covers the sign he is standing in front of. */}
      <div
        className={`pointer-events-none absolute inset-x-0 z-20 flex justify-center px-24 transition-all duration-200 coarse:bottom-[max(6.5rem,calc(env(safe-area-inset-bottom)+5.5rem))] fine:bottom-12 ${
          canRead ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        aria-hidden={!canRead}
      >
        <button
          type="button"
          onClick={teleport}
          tabIndex={canRead ? 0 : -1}
          className="hud-prompt pointer-events-auto flex max-w-full items-center gap-2 px-3 py-2 font-pixel text-[13px] leading-none"
        >
          <kbd className="hud-prompt-key fine-only px-[6px] py-[3px]">H</kbd>
          <span className="truncate">
            Read{" "}
            <span className="font-sans text-[13px] font-semibold text-[color:var(--crust)]">“{shown?.title}”</span>
          </span>
        </button>
      </div>

      <div className="fine-only pointer-events-none absolute bottom-4 left-6 z-20 flex items-center gap-4 font-pixel text-[12px] leading-none text-[color:var(--dust)]">
        <span className="signage flex items-center gap-1.5">
          <kbd className="hud-key">◀</kbd>
          <kbd className="hud-key">▶</kbd> move
        </span>
        <span className="signage flex items-center gap-1.5">
          <kbd className="hud-key">space</kbd> jump
        </span>
        <span className="signage flex items-center gap-1.5">
          <kbd className="hud-key">H</kbd> read
        </span>
      </div>
    </>
  );
};
