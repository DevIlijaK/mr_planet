"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Tuning is expressed relative to the viewport so the hero handles the same on
 * every screen. The blog rows are 25dvh tall with a 2.5dvh gap, so a jump has
 * to clear ~27.5% of the viewport height to reach the row above.
 */
const JUMP_HEIGHT_RATIO = 0.36;
const TIME_TO_APEX_SECONDS = 0.42;
const MOVE_SPEED_RATIO = 0.25;

interface PhysicsContextType {
  /** Horizontal run speed, px per second. */
  moveSpeed: number;
  /** Upward impulse applied at take-off, px per second. */
  jumpVelocity: number;
  /** Downward acceleration, px per second squared. */
  gravity: number;
  /** Terminal velocity, px per second. */
  maxFallSpeed: number;
  screenWidth: number;
  screenHeight: number;
}

const PhysicsContext = createContext<PhysicsContextType | undefined>(undefined);

export const usePhysicsContext = () => {
  const context = useContext(PhysicsContext);
  if (!context) {
    throw new Error("usePhysicsContext must be used within a PhysicsProvider");
  }
  return context;
};

export const PhysicsContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === "undefined" ? 0 : window.innerWidth,
    height: typeof window === "undefined" ? 0 : window.innerHeight,
  }));

  useEffect(() => {
    const handleResize = () =>
      setViewport((previous) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // Mobile browsers fire these in bursts as the URL bar slides. Handing
        // back the same object keeps the physics values — and so the game
        // loop's frame callback — from being rebuilt on every one of them.
        if (previous.width === width && previous.height === height) {
          return previous;
        }
        return { width, height };
      });

    handleResize();
    window.addEventListener("resize", handleResize);
    // Turning the phone doesn't always report through `resize` alone. This can
    // read the pre-rotation size — iOS fires it before the new one settles —
    // but a resize follows within the frame and the guard above means the
    // stale reading costs nothing when it was already correct.
    window.addEventListener("orientationchange", handleResize);
    /**
     * The one that matters on a phone: showing or hiding the URL bar changes
     * the visible height — and with it `100dvh`, and so where the floor is
     * drawn — without necessarily firing a window resize. `innerHeight` stays
     * the value being read, because unlike `visualViewport.height` it ignores
     * pinch-zoom, which must not be mistaken for the level getting shorter.
     */
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
    };
  }, []);

  const value = useMemo<PhysicsContextType>(() => {
    const jumpHeight = viewport.height * JUMP_HEIGHT_RATIO;

    /**
     * Derived from the two numbers that actually matter — how high the jump
     * goes and how long it takes to get there. Solving the constant
     * acceleration equations for h = v²/2g and t = v/g gives:
     */
    const jumpVelocity = (2 * jumpHeight) / TIME_TO_APEX_SECONDS;
    const gravity = (2 * jumpHeight) / TIME_TO_APEX_SECONDS ** 2;

    return {
      moveSpeed: viewport.width * MOVE_SPEED_RATIO,
      jumpVelocity,
      gravity,
      maxFallSpeed: jumpVelocity * 2,
      screenWidth: viewport.width,
      screenHeight: viewport.height,
    };
  }, [viewport]);

  return (
    <PhysicsContext.Provider value={value}>{children}</PhysicsContext.Provider>
  );
};
