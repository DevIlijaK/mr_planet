"use client";
import Image from "next/image";

import { useGameLoop } from "./providers/game-loop-context";
import { useSpace } from "./providers/space-provider";
import { useRef } from "react";
import { useHeroSize } from "./providers/hero-size-provider";
import { cn } from "~/lib/utils";

const Hero = () => {
  const { heroImage, heroTop, heroLeft, showTeleportModal } = useGameLoop();

  const { heroWidth, heroHeight } = useHeroSize();
  const { heroRef } = useSpace();
  const textRef = useRef<HTMLDivElement>(null);

  return (
    heroRef && (
      <div
        className="absolute"
        ref={heroRef}
        style={{ left: heroLeft, top: heroTop }}
      >
        {showTeleportModal && (
          <div
            ref={textRef}
            className={cn(
              "absolute left-1/2 inline-flex -translate-x-1/2 transform flex-col justify-center whitespace-nowrap rounded-2xl border border-solid bg-gray-700 p-2 text-sm",
            )}
            style={{ top: -90 }}
          >
            <div>{'Press "h"'}</div>
            <div>{"to teleport"}</div>
            <div>{"inside the blog"}</div>
          </div>
        )}

        <Image
          unoptimized
          src={heroImage}
          width={heroWidth}
          height={heroHeight}
          alt="planet"
          className="object-cover"
        />
      </div>
    )
  );
};

export default Hero;
