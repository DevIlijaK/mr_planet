"use client";

import { type StaticImageData } from "next/image";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import hero from "../../../public/images/hero/mr-planet.png";
import runRight from "../../../public/images/hero/run-right.gif";
import runLeft from "../../../public/images/hero/run-left.gif";
import jumpRight from "../../../public/images/hero/jump-right.png";
import jumpLeft from "../../../public/images/hero/jump-left.png";
import {
  createHeroState,
  stepHero,
  type Platform,
  type Tuning,
} from "~/lib/hero-physics";
import { type Level } from "~/lib/level";
import { RETURN_KEY, TELEPORT_MS } from "~/lib/teleport";
import { usePressedKeysContext } from "./pressed-keys-provider";

/**
 * Longest frame the simulation will accept. requestAnimationFrame stops while
 * the tab is hidden, so without this the first frame back would be one enormous
 * step that flings the hero straight through the floor.
 */
const MAX_FRAME_SECONDS = 1 / 30;

/** Where the hero's feet sit on screen once the camera starts following. */
const CAMERA_ANCHOR = 0.6;
const CAMERA_STIFFNESS = 9;

export type Phase = "arriving" | "playing" | "teleporting";

interface GameLoopContextType {
  heroImage: StaticImageData;
  /** Id of the ledge under the hero; null on the floor or in the air. */
  standingId: string | null;
  phase: Phase;
  /** True while there are ledges scrolled off the top of the screen. */
  hasMoreAbove: boolean;
  /** Beam into the post under the hero. Ignored when there isn't one. */
  teleport: () => void;
  heroRef: React.MutableRefObject<HTMLDivElement | null>;
  worldRef: React.MutableRefObject<HTMLDivElement | null>;
}

const GameLoopContext = createContext<GameLoopContextType | undefined>(
  undefined,
);

interface GameLoopProviderProps {
  level: Level;
  tuning: Tuning;
  heroWidth: number;
  heroHeight: number;
  viewportHeight: number;
  spawn: { x: number; y: number };
  /** Play the beam-in on mount — the hero just came back from a post. */
  arriving: boolean;
  children: ReactNode;
}

export const GameLoopProvider: React.FC<GameLoopProviderProps> = ({
  level,
  tuning,
  heroWidth,
  heroHeight,
  viewportHeight,
  spawn,
  arriving,
  children,
}) => {
  const router = useRouter();
  const { pressedKeys, consumePress } = usePressedKeysContext();

  const [heroImage, setHeroImage] = useState<StaticImageData>(hero);
  const [standingId, setStandingId] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(arriving ? "arriving" : "playing");
  const [hasMoreAbove, setHasMoreAbove] = useState(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);

  const state = useRef(createHeroState(spawn.x, spawn.y));
  const camera = useRef(0);
  /** Mirrors of the React state so the loop can diff without re-reading it. */
  const rendered = useRef({
    image: hero,
    standingId: null as string | null,
    hasMoreAbove: false,
  });
  const phaseRef = useRef<Phase>(phase);
  phaseRef.current = phase;

  const platforms = useMemo<Platform[]>(
    () => [
      ...level.platforms.map((p) => ({
        id: p.id,
        top: p.y,
        left: p.x,
        right: p.x + p.width,
        isFloor: false,
      })),
      {
        top: level.floor.top,
        left: 0,
        right: level.worldWidth,
        isFloor: true,
      },
    ],
    [level],
  );

  const cameraTarget = useCallback(
    (heroY: number) => {
      const max = level.worldHeight - viewportHeight;
      const target = heroY + heroHeight - viewportHeight * CAMERA_ANCHOR;
      return Math.max(0, Math.min(target, max));
    },
    [heroHeight, level.worldHeight, viewportHeight],
  );

  // A new level (first mount, or a resize) means new coordinates: put the hero
  // back on his spawn point and snap the camera to him, no sweep. A layout
  // effect so the first paint is already in place.
  useLayoutEffect(() => {
    state.current = createHeroState(spawn.x, spawn.y);
    camera.current = cameraTarget(spawn.y);
    if (heroRef.current) {
      heroRef.current.style.transform = `translate3d(${spawn.x}px, ${spawn.y}px, 0)`;
    }
    if (worldRef.current) {
      worldRef.current.style.transform = `translate3d(0, ${-camera.current}px, 0)`;
    }
  }, [level, spawn, cameraTarget]);

  useEffect(() => {
    if (phase !== "arriving") return;
    const timer = setTimeout(() => setPhase("playing"), TELEPORT_MS);
    return () => clearTimeout(timer);
  }, [phase]);

  // Landing on a post is the cue to prefetch it, so the beam-out lands on a
  // page that is already there.
  useEffect(() => {
    if (!standingId) return;
    const platform = level.platforms.find((p) => p.id === standingId);
    if (platform?.post) router.prefetch(`/blog/${platform.post.slug}`);
  }, [standingId, level.platforms, router]);

  const teleport = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    const platform = level.platforms.find(
      (p) => p.id === rendered.current.standingId,
    );
    if (!platform?.post) return;

    const { slug } = platform.post;
    setPhase("teleporting");
    try {
      sessionStorage.setItem(RETURN_KEY, slug);
    } catch {
      // Private mode or blocked storage: he'll just respawn on the floor.
    }
    setTimeout(() => router.push(`/blog/${slug}`), TELEPORT_MS);
  }, [level.platforms, router]);

  const frame = useCallback(
    (delta: number) => {
      const keys = pressedKeys.current;
      const playing = phaseRef.current === "playing";

      if (playing) {
        const { state: next, standingOn } = stepHero(
          state.current,
          {
            left: keys.has("left"),
            right: keys.has("right"),
            jumpPressed: consumePress("jump"),
          },
          {
            platforms,
            screenWidth: level.worldWidth,
            screenHeight: level.worldHeight,
            heroWidth,
            heroHeight,
            tuning,
          },
          delta,
        );
        state.current = next;

        const direction =
          (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
        const image = !next.grounded
          ? next.facing === 1
            ? jumpRight
            : jumpLeft
          : direction === 1
            ? runRight
            : direction === -1
              ? runLeft
              : hero;
        if (image !== rendered.current.image) {
          rendered.current.image = image;
          setHeroImage(image);
        }

        // The floor is a platform too, but it isn't a blog to teleport into.
        const id = standingOn && !standingOn.isFloor ? standingOn.id! : null;
        if (id !== rendered.current.standingId) {
          rendered.current.standingId = id;
          setStandingId(id);
        }

        if (consumePress("teleport")) teleport();
      } else {
        // Frozen mid-beam. Drop any presses so they don't fire on arrival.
        consumePress("jump");
        consumePress("teleport");
      }

      const { x, y } = state.current;
      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      // The camera eases toward the hero rather than tracking him rigidly, so
      // a jump reads as the hero moving, not the world.
      const target = cameraTarget(y);
      camera.current +=
        (target - camera.current) * Math.min(1, CAMERA_STIFFNESS * delta);
      if (Math.abs(target - camera.current) < 0.5) camera.current = target;
      if (worldRef.current) {
        worldRef.current.style.transform = `translate3d(0, ${-camera.current}px, 0)`;
      }

      // Anything whose ledge sits above the top of the screen.
      const above = level.platforms.some((p) => p.y < camera.current);
      if (above !== rendered.current.hasMoreAbove) {
        rendered.current.hasMoreAbove = above;
        setHasMoreAbove(above);
      }
    },
    [
      cameraTarget,
      consumePress,
      heroHeight,
      heroWidth,
      level.platforms,
      level.worldHeight,
      level.worldWidth,
      platforms,
      pressedKeys,
      teleport,
      tuning,
    ],
  );

  useEffect(() => {
    let handle = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(
        Math.max(0, (now - previous) / 1000),
        MAX_FRAME_SECONDS,
      );
      previous = now;
      frame(delta);
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [frame]);

  const value = useMemo<GameLoopContextType>(
    () => ({
      heroImage,
      standingId,
      phase,
      hasMoreAbove,
      teleport,
      heroRef,
      worldRef,
    }),
    [heroImage, standingId, phase, hasMoreAbove, teleport],
  );

  return (
    <GameLoopContext.Provider value={value}>
      {children}
    </GameLoopContext.Provider>
  );
};

export const useGameLoop = (): GameLoopContextType => {
  const context = useContext(GameLoopContext);
  if (!context) {
    throw new Error("useGameLoop must be used within a GameLoopProvider");
  }
  return context;
};
