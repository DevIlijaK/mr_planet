"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

/** Actions the hero understands, decoupled from the physical keys bound to them. */
export type GameKey = "left" | "right" | "jump" | "teleport";

const KEY_BINDINGS: Record<string, GameKey> = {
  a: "left",
  arrowleft: "left",
  d: "right",
  arrowright: "right",
  w: "jump",
  arrowup: "jump",
  " ": "jump",
  h: "teleport",
  enter: "teleport",
};

/** Keys the browser would otherwise use to scroll the page. */
const SCROLL_KEYS = new Set(["arrowleft", "arrowright", "arrowup", " "]);

interface PressedKeysContextType {
  /**
   * Keys currently held down. A ref rather than state: the game loop reads it
   * every frame, and re-rendering the tree on each keypress is both wasteful
   * and a source of stale closures inside the loop.
   */
  pressedKeys: React.MutableRefObject<Set<GameKey>>;
  /**
   * Edge-triggered read for one-shot actions like jumping. Returns true once
   * per physical press, so holding the key down doesn't repeat the action.
   */
  consumePress: (key: GameKey) => boolean;
  /** For on-screen buttons: the same as a key going down / coming up. */
  press: (key: GameKey) => void;
  release: (key: GameKey) => void;
}

const PressedKeysContext = createContext<PressedKeysContextType | undefined>(
  undefined,
);

export const usePressedKeysContext = () => {
  const context = useContext(PressedKeysContext);
  if (!context) {
    throw new Error(
      "usePressedKeysContext must be used within a PressedKeysProvider",
    );
  }
  return context;
};

export const PressedKeysProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const pressedKeys = useRef<Set<GameKey>>(new Set());
  const freshPresses = useRef<Set<GameKey>>(new Set());

  const value = useMemo<PressedKeysContextType>(() => {
    const press = (key: GameKey) => {
      freshPresses.current.add(key);
      pressedKeys.current.add(key);
    };
    const release = (key: GameKey) => {
      pressedKeys.current.delete(key);
    };
    return {
      pressedKeys,
      consumePress: (key) => freshPresses.current.delete(key),
      press,
      release,
    };
  }, []);

  useEffect(() => {
    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || isTyping(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const lowered = event.key.toLowerCase();
      const key = KEY_BINDINGS[lowered];
      if (!key) return;
      if (SCROLL_KEYS.has(lowered)) event.preventDefault();
      value.press(key);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = KEY_BINDINGS[event.key.toLowerCase()];
      if (key) value.release(key);
    };

    /**
     * Key-up never arrives if the tab loses focus mid-press, which would leave
     * the hero running in that direction forever.
     */
    const handleBlur = () => {
      pressedKeys.current.clear();
      freshPresses.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [value]);

  return (
    <PressedKeysContext.Provider value={value}>
      {children}
    </PressedKeysContext.Provider>
  );
};
