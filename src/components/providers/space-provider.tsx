"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { type Platform } from "~/lib/hero-physics";

export interface StandingOn {
  rect: Platform;
  element: HTMLDivElement;
}

interface SpaceContextType {
  /** Every surface the hero can stand on. */
  ramps: React.MutableRefObject<Set<HTMLDivElement>>;
  /** Registers a ramp and returns the matching cleanup, for use from an effect. */
  registerRamp: (element: HTMLDivElement) => () => void;
  heroRef: React.MutableRefObject<HTMLDivElement | null>;
  /** The ramp the hero is currently standing on, or null while airborne. */
  standingElement: React.MutableRefObject<StandingOn | null>;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  /**
   * A Set rather than an array: ramps register from an effect, and in strict
   * mode (or on any remount) an array quietly collects duplicates of the same
   * element.
   */
  const ramps = useRef<Set<HTMLDivElement>>(new Set());
  const heroRef = useRef<HTMLDivElement | null>(null);
  const standingElement = useRef<StandingOn | null>(null);

  const registerRamp = useCallback((element: HTMLDivElement) => {
    ramps.current.add(element);
    return () => {
      ramps.current.delete(element);
    };
  }, []);

  const value = useMemo<SpaceContextType>(
    () => ({ ramps, registerRamp, heroRef, standingElement }),
    [registerRamp],
  );

  return (
    <SpaceContext.Provider value={value}>{children}</SpaceContext.Provider>
  );
};

export const useSpace = (): SpaceContextType => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context;
};
