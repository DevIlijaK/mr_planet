"use client";

import React, { useCallback, useEffect, useRef } from "react";

import {
  usePressedKeysContext,
  type GameKey,
} from "./providers/pressed-keys-provider";

/**
 * A single control that behaves like a held key rather than a click: it goes
 * down on touch and stays down until the finger lifts.
 *
 * Each button owns one pointer at a time, which is what lets several be held
 * together — running right while jumping is the whole game — without one
 * finger stealing another's button.
 *
 * A stuck direction is the worst failure this component has, because it leaves
 * the hero sprinting into a wall with no way to stop him, so the release path
 * is deliberately belt-and-braces: pointer capture keeps a finger that drifts
 * off the edge from dropping the input, and a window-level listener ends the
 * hold even when capture was refused and no event ever reaches the button.
 */
const HoldButton: React.FC<{
  action: GameKey;
  label: string;
  className?: string;
  children: React.ReactNode;
}> = ({ action, label, className = "", children }) => {
  const { press, release } = usePressedKeysContext();
  /** The pointer that owns this button, or null while it is free. */
  const owner = useRef<number | null>(null);
  const detach = useRef<(() => void) | null>(null);

  const finish = useCallback(
    (pointerId: number) => {
      // Ignore a lift belonging to some other finger, and make a second call
      // for the same one a no-op — several paths can report the same release.
      if (owner.current !== pointerId) return;
      owner.current = null;
      detach.current?.();
      detach.current = null;
      release(action);
    },
    [action, release],
  );

  const start = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (owner.current !== null) return;
      // Stops the tap from also becoming a mouse event, a text selection, or
      // focus — none of which a gamepad button should produce.
      event.preventDefault();

      const { pointerId, currentTarget } = event;
      owner.current = pointerId;
      press(action);

      try {
        currentTarget.setPointerCapture(pointerId);
      } catch {
        // Capture is a nicety; the listeners below are the actual guarantee.
      }

      const onEnd = (ended: PointerEvent) => finish(ended.pointerId);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
      detach.current = () => {
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
      };
    },
    [action, finish, press],
  );

  // Unmounting mid-hold — an orientation change that re-renders the tree, say
  // — would otherwise leave the hero running forever.
  useEffect(
    () => () => {
      detach.current?.();
      release(action);
    },
    [action, release],
  );

  return (
    <button
      type="button"
      aria-label={label}
      className={`touch-button pointer-events-auto ${className}`}
      onPointerDown={start}
      onPointerUp={(event) => finish(event.pointerId)}
      onPointerCancel={(event) => finish(event.pointerId)}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  );
};

/**
 * The phone's stand-in for the keyboard: a two-way pad on the left, jump under
 * the right thumb.
 *
 * It floats over the floor band rather than taking a row in the layout, so the
 * level is the same level it is on a desktop — the hero stands on top of the
 * floor, and these sit in the rock below his feet.
 */
export const TouchControls: React.FC = () => (
  <div
    className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex items-end justify-between px-[4dvw] pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    // The controls are the one part of the page a stray swipe must never
    // scroll or zoom.
    style={{ touchAction: "none" }}
  >
    <div className="flex gap-3">
      <HoldButton action="left" label="Move left">
        <span className="touch-arrow touch-arrow-left" />
      </HoldButton>
      <HoldButton action="right" label="Move right">
        <span className="touch-arrow touch-arrow-right" />
      </HoldButton>
    </div>

    <HoldButton action="jump" label="Jump" className="touch-button-jump">
      <span className="touch-arrow touch-arrow-up" />
    </HoldButton>
  </div>
);

export default TouchControls;
