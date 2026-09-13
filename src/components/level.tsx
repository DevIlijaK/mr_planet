"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import bg from "../../public/images/background.gif";
import { useViewport } from "~/hooks/use-viewport";
import { buildLevel, spawnPoint, type LevelPost } from "~/lib/level";
import { heroSizeFor, tuningFor } from "~/lib/tuning";
import Hero from "./hero";
import { Hud } from "./hud";
import { Platform } from "./platform";
import { TouchControls } from "./touch-controls";
import { GameLoopProvider, useGameLoop } from "./providers/game-loop-context";
import { RETURN_KEY } from "~/lib/teleport";
import { PressedKeysProvider } from "./providers/pressed-keys-provider";

/**
 * The blog, as a level. Posts come in newest first; the generator turns them
 * into ledges, and the game loop moves the hero and the camera through them.
 */
export const Level: FC<{ posts: LevelPost[] }> = ({ posts }) => {
  const viewport = useViewport();
  // undefined = not read yet, null = nothing to return to.
  const [returnTo, setReturnTo] = useState<string | null | undefined>();
  const consumedReturn = useRef(false);

  useEffect(() => {
    // Read once. Strict mode runs effects twice on mount, and the second run
    // would find the key already gone.
    if (consumedReturn.current) return;
    consumedReturn.current = true;
    let slug: string | null = null;
    try {
      slug = sessionStorage.getItem(RETURN_KEY);
      sessionStorage.removeItem(RETURN_KEY);
    } catch {
      // Storage blocked; spawn on the floor.
    }
    setReturnTo(slug);
  }, []);

  const heroSize = useMemo(() => heroSizeFor(viewport.width), [viewport.width]);
  const tuning = useMemo(
    () => tuningFor(viewport.width, viewport.height),
    [viewport.width, viewport.height],
  );
  const level = useMemo(
    () =>
      buildLevel({
        posts,
        width: viewport.width,
        height: viewport.height,
        heroWidth: heroSize.width,
      }),
    [posts, viewport.width, viewport.height, heroSize.width],
  );
  const spawn = useMemo(
    () => spawnPoint(level, heroSize.width, heroSize.height, returnTo),
    [level, heroSize.width, heroSize.height, returnTo],
  );

  const ready = viewport.width > 0 && returnTo !== undefined;

  return (
    <main className="relative h-[100dvh] w-full touch-none select-none overflow-hidden">
      <Image
        // The starfield is an animated GIF; the optimizer would flatten it.
        unoptimized
        priority
        src={bg}
        alt=""
        aria-hidden
        className="pixelated -z-10 object-cover object-center"
        fill
      />
      {/* The starfield is loud; a wash keeps it moving without shouting over
          the signs. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[rgb(11_10_31_/_0.55)]"
      />

      {ready && (
        <PressedKeysProvider>
          <GameLoopProvider
            // Remount the loop when the level changes shape, so nothing from
            // the old coordinates survives.
            key={`${viewport.width}x${viewport.height}`}
            level={level}
            tuning={tuning}
            heroWidth={heroSize.width}
            heroHeight={heroSize.height}
            viewportHeight={viewport.height}
            spawn={spawn}
            arriving={returnTo !== null}
          >
            <World
              level={level}
              heroWidth={heroSize.width}
              heroHeight={heroSize.height}
              postCount={posts.length}
            />
          </GameLoopProvider>
        </PressedKeysProvider>
      )}
    </main>
  );
};

interface WorldProps {
  level: ReturnType<typeof buildLevel>;
  heroWidth: number;
  heroHeight: number;
  postCount: number;
}

const World: FC<WorldProps> = ({ level, heroWidth, heroHeight, postCount }) => {
  const { standingId, worldRef } = useGameLoop();
  const standingOn = level.platforms.find((p) => p.id === standingId) ?? null;
  const post = standingOn?.post ?? null;

  return (
    <>
      <div
        ref={worldRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ width: level.worldWidth, height: level.worldHeight }}
      >
        {level.platforms.map((platform) => (
          <Platform
            key={platform.id}
            platform={platform}
            ledgeHeight={level.ledgeHeight}
            headroom={level.headroom}
            overhang={Math.round(heroWidth * 1.3)}
            active={platform.id === standingId}
          />
        ))}

        <div
          className="terrain absolute left-0 w-full"
          style={{ top: level.floor.top, height: level.floor.height }}
        />

        <Hero width={heroWidth} height={heroHeight} />
      </div>

      <Hud postCount={postCount} post={post} />
      <TouchControls />
    </>
  );
};
