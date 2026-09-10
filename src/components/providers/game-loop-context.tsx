"use client";

import { type StaticImageData } from "next/image";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import hero from "../../../public/images/hero/mr-planet.png";
import runRight from "../../../public/images/hero/run-right.gif";
import runLeft from "../../../public/images/hero/run-left.gif";
import jumpRight from "../../../public/images/hero/jump-right.png";
import jumpLeft from "../../../public/images/hero/jump-left.png";
import { createHeroState, stepHero, type Platform } from "~/lib/hero-physics";
import { usePhysicsContext } from "./physics-provider";
import { usePressedKeysContext } from "./pressed-keys-provider";
import { useSpace } from "./space-provider";
import { useHeroSize } from "./hero-size-provider";

/**
 * Longest frame the simulation will accept. requestAnimationFrame stops while
 * the tab is hidden, so without this the first frame back would be one enormous
 * step that flings the hero straight through the floor.
 */
const MAX_FRAME_SECONDS = 1 / 30;

interface GameLoopContextType {
  heroImage: StaticImageData;
  showTeleportModal: boolean;
}

const GameLoopContext = createContext<GameLoopContextType | undefined>(
  undefined,
);

export const GameLoopProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const {
    moveSpeed,
    jumpVelocity,
    gravity,
    maxFallSpeed,
    screenWidth,
    screenHeight,
  } = usePhysicsContext();
  const { pressedKeys, consumePress } = usePressedKeysContext();
  const { heroWidth, heroHeight } = useHeroSize();
  const { ramps, heroRef, standingElement } = useSpace();

  const [heroImage, setHeroImage] = useState<StaticImageData>(hero);
  const [showTeleportModal, setShowTeleportModal] = useState(false);

  const state = useRef(createHeroState(50, 0));
  /** Mirrors the React state so the loop can diff without re-reading it. */
  const renderedImage = useRef<StaticImageData>(hero);
  const renderedModal = useRef(false);
  /** The ledge currently lit up, so it can be dimmed again on the way out. */
  const litLedge = useRef<HTMLDivElement | null>(null);

  const frame = useCallback(
    (delta: number) => {
      const keys = pressedKeys.current;

      // Measured fresh each frame: the blog grid scrolls, and the cards move
      // with it.
      const elements: HTMLDivElement[] = [];
      const platforms: Platform[] = [];
      for (const ramp of ramps.current) {
        const rect = ramp.getBoundingClientRect();
        elements.push(ramp);
        platforms.push({
          top: rect.top,
          left: rect.left,
          right: rect.right,
          isFloor: ramp.dataset.floor === "true",
        });
      }

      const { state: next, standingOn } = stepHero(
        state.current,
        {
          left: keys.has("left"),
          right: keys.has("right"),
          jumpPressed: consumePress("jump"),
        },
        {
          platforms,
          screenWidth,
          screenHeight,
          heroWidth,
          heroHeight,
          tuning: { moveSpeed, jumpVelocity, gravity, maxFallSpeed },
        },
        delta,
      );
      state.current = next;

      const landedIndex = standingOn ? platforms.indexOf(standingOn) : -1;
      standingElement.current =
        landedIndex === -1
          ? null
          : { rect: platforms[landedIndex]!, element: elements[landedIndex]! };

      // Light the ledge under the hero. Toggled straight on the node — this
      // runs every frame and has no business re-rendering the whole grid.
      const toLight =
        standingOn && !standingOn.isFloor ? elements[landedIndex]! : null;
      if (toLight !== litLedge.current) {
        litLedge.current?.classList.remove("terrain-ledge-active");
        toLight?.classList.add("terrain-ledge-active");
        litLedge.current = toLight;
      }

      if (heroRef.current) {
        heroRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`;
      }

      const direction =
        (keys.has("right") ? 1 : 0) - (keys.has("left") ? 1 : 0);
      const nextImage = !next.grounded
        ? next.facing === 1
          ? jumpRight
          : jumpLeft
        : direction === 1
          ? runRight
          : direction === -1
            ? runLeft
            : hero;

      if (nextImage !== renderedImage.current) {
        renderedImage.current = nextImage;
        setHeroImage(nextImage);
      }

      // The floor is a platform too, but it isn't a blog to teleport into.
      const onBlog = standingOn !== null && !standingOn.isFloor;
      if (onBlog !== renderedModal.current) {
        renderedModal.current = onBlog;
        setShowTeleportModal(onBlog);
      }
    },
    [
      consumePress,
      gravity,
      heroHeight,
      heroRef,
      heroWidth,
      jumpVelocity,
      maxFallSpeed,
      moveSpeed,
      pressedKeys,
      ramps,
      screenHeight,
      screenWidth,
      standingElement,
    ],
  );

  useEffect(() => {
    let handle = 0;
    let previous = performance.now();

    const tick = (now: number) => {
      const delta = Math.min((now - previous) / 1000, MAX_FRAME_SECONDS);
      previous = now;
      frame(delta);
      handle = requestAnimationFrame(tick);
    };

    handle = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(handle);
  }, [frame]);

  return (
    <GameLoopContext.Provider value={{ heroImage, showTeleportModal }}>
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
