/**
 * The hero's motion, as a pure function of state and input.
 *
 * Kept free of React and the DOM so it can be reasoned about and tested on its
 * own: the caller measures the platforms, calls `stepHero` once per frame, and
 * paints the result.
 */

/** A jump pressed this long before landing still fires on touchdown. */
export const JUMP_BUFFER_SECONDS = 0.12;
/** Grace period after walking off a ledge during which a jump still works. */
export const COYOTE_SECONDS = 0.1;

export interface HeroState {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  grounded: boolean;
  facing: 1 | -1;
  /** Seconds left on a queued jump press. */
  jumpBuffer: number;
  /** Seconds left in which a jump is still allowed after leaving the ground. */
  coyote: number;
}

export interface HeroInput {
  left: boolean;
  right: boolean;
  /** True only on the frame the jump key went down, not while it is held. */
  jumpPressed: boolean;
}

export interface Platform {
  top: number;
  left: number;
  right: number;
  /** The ground is a platform too, but it isn't a blog to teleport into. */
  isFloor: boolean;
}

export interface Tuning {
  moveSpeed: number;
  jumpVelocity: number;
  gravity: number;
  maxFallSpeed: number;
}

export interface World {
  platforms: Platform[];
  screenWidth: number;
  screenHeight: number;
  heroWidth: number;
  heroHeight: number;
  tuning: Tuning;
}

export interface StepResult {
  state: HeroState;
  /** The platform the hero is resting on this frame, if any. */
  standingOn: Platform | null;
}

export function createHeroState(x: number, y: number): HeroState {
  return {
    x,
    y,
    velocityX: 0,
    velocityY: 0,
    grounded: false,
    facing: 1,
    jumpBuffer: 0,
    coyote: 0,
  };
}

export function stepHero(
  previous: HeroState,
  input: HeroInput,
  world: World,
  delta: number,
): StepResult {
  const { tuning, heroWidth, heroHeight, screenWidth, screenHeight } = world;
  const state: HeroState = { ...previous };

  state.coyote = Math.max(0, state.coyote - delta);
  state.jumpBuffer = Math.max(0, state.jumpBuffer - delta);
  if (input.jumpPressed) state.jumpBuffer = JUMP_BUFFER_SECONDS;

  // Horizontal velocity is read straight off the keys held this frame, on the
  // ground and in the air alike, so a jump can be steered while it's happening.
  const direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  state.velocityX = direction * tuning.moveSpeed;
  if (direction !== 0) state.facing = direction as 1 | -1;

  if (state.jumpBuffer > 0 && state.coyote > 0) {
    state.velocityY = -tuning.jumpVelocity;
    state.jumpBuffer = 0;
    state.coyote = 0;
    state.grounded = false;
  }

  const acceleratedY = Math.min(
    state.velocityY + tuning.gravity * delta,
    tuning.maxFallSpeed,
  );

  const previousBottom = previous.y + heroHeight;
  state.x += state.velocityX * delta;
  // Integrating with the average of the frame's start and end velocity is exact
  // under constant acceleration. Moving by the end velocity alone (plain Euler)
  // loses half a frame of travel on every step, which quietly shortens the jump
  // by a few percent and makes the height depend on the frame rate.
  state.y += ((state.velocityY + acceleratedY) / 2) * delta;
  state.velocityY = acceleratedY;

  // Walls.
  state.x = Math.max(0, Math.min(state.x, screenWidth - heroWidth));

  // Ceiling. Jumping from the top row would otherwise carry him off the top of
  // the viewport, where there is nothing to see and no way to steer.
  if (state.y < 0) {
    state.y = 0;
    if (state.velocityY < 0) state.velocityY = 0;
  }

  state.grounded = false;
  let standingOn: Platform | null = null;

  // Platforms are one-way: they only catch the hero on the way down, so he can
  // jump up through a row of asteroids and land on top of it.
  if (state.velocityY >= 0) {
    const bottom = state.y + heroHeight;

    for (const platform of world.platforms) {
      const overlapsHorizontally =
        state.x + heroWidth > platform.left && state.x < platform.right;
      const crossedTopEdge =
        previousBottom <= platform.top + 0.5 && bottom >= platform.top;

      if (!overlapsHorizontally || !crossedTopEdge) continue;
      // Falling past several in one frame lands him on the highest of them.
      if (!standingOn || platform.top < standingOn.top) standingOn = platform;
    }

    if (standingOn) {
      state.y = standingOn.top - heroHeight;
      state.velocityY = 0;
      state.grounded = true;
    }
  }

  // Last resort, so he can never leave the screen through the bottom.
  if (state.y + heroHeight > screenHeight) {
    state.y = screenHeight - heroHeight;
    state.velocityY = 0;
    state.grounded = true;
  }

  if (state.grounded) state.coyote = COYOTE_SECONDS;

  return { state, standingOn };
}
