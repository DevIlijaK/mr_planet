"use client";

import { type FC, type PointerEvent } from "react";
import {
  usePressedKeysContext,
  type GameKey,
} from "./providers/pressed-keys-provider";

/**
 * On-screen buttons for touch screens: the same press / release the keyboard
 * produces, so the physics can't tell the two apart. Shown only when the
 * primary pointer is coarse (see `.coarse-only`). Reading is the HUD prompt,
 * which is a button on every kind of screen.
 */
export const TouchControls: FC = () => {
  const { press, release } = usePressedKeysContext();

  const hold = (key: GameKey) => ({
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      press(key);
    },
    onPointerUp: () => release(key),
    onPointerCancel: () => release(key),
    onLostPointerCapture: () => release(key),
    onContextMenu: (event: PointerEvent<HTMLButtonElement>) =>
      event.preventDefault(),
  });

  return (
    <div className="coarse-only pointer-events-none absolute inset-x-0 bottom-0 z-30 items-end justify-between px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="pointer-events-auto flex gap-3">
        <button
          type="button"
          className="touch-key"
          aria-label="Move left"
          {...hold("left")}
        >
          ◀
        </button>
        <button
          type="button"
          className="touch-key"
          aria-label="Move right"
          {...hold("right")}
        >
          ▶
        </button>
      </div>

      <div className="pointer-events-auto flex items-end gap-3">
        <button
          type="button"
          className="touch-key touch-key-jump"
          aria-label="Jump"
          {...hold("jump")}
        >
          ▲
        </button>
      </div>
    </div>
  );
};
