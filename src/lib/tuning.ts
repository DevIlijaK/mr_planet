/**
 * Everything about the hero that scales with the screen, as pure functions of
 * the viewport. The level generator and the physics both read from here, so
 * the two can never disagree about how big a jump is.
 */
import { type Tuning } from "./hero-physics";

/** The sprite sheet is drawn at this size. */
const SPRITE_WIDTH = 150;
const SPRITE_HEIGHT = 231;

/**
 * Jump height as a share of the viewport. Rows are ROW_PITCH_RATIO (0.25)
 * apart, so this clears the next row with a third of the jump to spare.
 */
export const JUMP_HEIGHT_RATIO = 0.36;
const TIME_TO_APEX_SECONDS = 0.42;
const MOVE_SPEED_RATIO = 0.3;

export function heroSizeFor(width: number): { width: number; height: number } {
  // Scaling by a whole-number divisor keeps every source pixel the same size
  // on screen; anything else makes the pixel art shimmer once
  // `image-rendering: pixelated` is on.
  const divisor = width < 640 ? 5 : width < 1024 ? 4 : 3;
  return {
    width: Math.round(SPRITE_WIDTH / divisor),
    height: Math.round(SPRITE_HEIGHT / divisor),
  };
}

export function tuningFor(width: number, height: number): Tuning {
  const jumpHeight = height * JUMP_HEIGHT_RATIO;

  // Derived from the two numbers that actually matter — how high the jump
  // goes and how long it takes to get there. Solving the constant
  // acceleration equations for h = v²/2g and t = v/g gives:
  const jumpVelocity = (2 * jumpHeight) / TIME_TO_APEX_SECONDS;
  const gravity = (2 * jumpHeight) / TIME_TO_APEX_SECONDS ** 2;

  return {
    moveSpeed: width * MOVE_SPEED_RATIO,
    jumpVelocity,
    gravity,
    maxFallSpeed: jumpVelocity * 2,
  };
}
