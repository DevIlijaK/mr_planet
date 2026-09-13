"use client";

import Image from "next/image";
import { type FC } from "react";
import { useGameLoop } from "./providers/game-loop-context";

interface HeroProps {
  width: number;
  height: number;
}

const Hero: FC<HeroProps> = ({ width, height }) => {
  const { heroImage, phase, heroRef } = useGameLoop();

  return (
    // Position is written straight to `transform` by the game loop rather than
    // held in state, so the hero moves without re-rendering React each frame.
    <div
      ref={heroRef}
      className="absolute left-0 top-0 z-10 will-change-transform"
      style={{ width, height }}
    >
      <div
        className={`relative h-full w-full ${
          phase === "teleporting"
            ? "hero-beam-out"
            : phase === "arriving"
              ? "hero-beam-in"
              : ""
        }`}
      >
        <div className="beam" aria-hidden />
        <Image
          unoptimized
          priority
          src={heroImage}
          width={width}
          height={height}
          alt="Mr. Planet"
          className="pixelated relative object-contain object-bottom"
          // The run and jump frames are a few pixels taller than the idle
          // one; pinning the box keeps his feet where the physics says.
          style={{ width, height }}
        />
      </div>
    </div>
  );
};

export default Hero;
