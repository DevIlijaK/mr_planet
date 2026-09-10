"use client";
import Image from "next/image";

import { useGameLoop } from "./providers/game-loop-context";
import { useSpace } from "./providers/space-provider";
import { useHeroSize } from "./providers/hero-size-provider";
import { usePressedKeysContext } from "./providers/pressed-keys-provider";
import useCoarsePointer from "~/hooks/use-coarse-pointer";

const Hero = () => {
  const { heroImage, showTeleportModal } = useGameLoop();
  const { heroWidth, heroHeight } = useHeroSize();
  const { heroRef } = useSpace();
  const { press, release } = usePressedKeysContext();
  const onTouch = useCoarsePointer();

  return (
    // Position is written straight to `transform` by the game loop rather than
    // held in state, so the hero moves without re-rendering React each frame.
    <div className="absolute left-0 top-0 will-change-transform" ref={heroRef}>
      {showTeleportModal &&
        // Same prompt, same action, two ways in. On a keyboard it names the key
        // to press; on a phone, where there is no H to name, the prompt itself
        // is the button.
        (onTouch ? (
          <button
            type="button"
            className="hud-prompt hud-prompt-tappable absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 items-center whitespace-nowrap px-3 py-2 font-pixel text-[13px] leading-none"
            onPointerDown={(event) => {
              event.preventDefault();
              press("teleport");
            }}
            onPointerUp={() => release("teleport")}
            onPointerCancel={() => release("teleport")}
            onContextMenu={(event) => event.preventDefault()}
          >
            Read this post
          </button>
        ) : (
          <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2">
            <div className="hud-prompt flex items-center gap-2 whitespace-nowrap px-2 py-1 font-pixel text-[12px] leading-none">
              <span className="hud-prompt-key px-[5px] py-[3px]">H</span>
              <span>Read this post</span>
            </div>
          </div>
        ))}

      <Image
        unoptimized
        priority
        src={heroImage}
        width={heroWidth}
        height={heroHeight}
        alt="Mr. Planet"
        className="pixelated"
      />
    </div>
  );
};

export default Hero;
