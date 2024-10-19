"use client";
import Image from "next/image";

import { useGameLoop } from "./providers/game-loop-context";
import { useSpace } from "./providers/space-provider";

const Hero = () => {
  const { heroImage, heroTop, heroLeft } = useGameLoop();
  const { heroRef } = useSpace();

  return (
    heroRef && (
      <div
        className="absolute h-[77px] w-[50px]"
        ref={heroRef}
        style={{ left: heroLeft, top: heroTop }} // Ensure you're using heroLeft and heroTop
      >
        <Image
          unoptimized
          src={heroImage} // Use the heroImage from context
          width={50}
          height={77}
          alt="planet"
          className="object-cover"
        />
      </div>
    )
  );
};

export default Hero;
