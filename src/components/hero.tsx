"use client";
import Image from "next/image";

import { useGameLoop } from "./providers/game-loop-context";
import { useSpace } from "./providers/space-provider";
import { useAnimate } from "framer-motion";
import { useState } from "react";
import { usePhysicsContext } from "./providers/physics-provider";
import { useHeroSize } from "./providers/hero-size-provider";

const Hero = () => {
  const { setHeroLeft, setHeroTop, heroImage, heroTop, heroLeft } =
    useGameLoop();

  const { heroWidth, heroHeight } = useHeroSize();
  const { initialX, initialY, screenHeight, screenWidth } = usePhysicsContext();
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);
  const { heroRef } = useSpace();
  // console.log("test", screenHeight * 0.9 - heroHeight);
  const topValue = Math.round(screenHeight * 0.9 - heroHeight);

  const [scope, animate] = useAnimate();

  return (
    heroRef && (
      <div
        className="absolute"
        ref={heroRef}
        style={{ left: heroLeft, top: heroTop }}
      >
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
