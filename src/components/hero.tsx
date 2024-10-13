"use client";
import Image, { type StaticImageData } from "next/image";
import { forwardRef } from "react";

import React from "react";

type HeroProps = {
  hero: StaticImageData;
  left: number;
  top: number;
} & React.HTMLProps<HTMLDivElement>;

const Hero = forwardRef<HTMLDivElement, HeroProps>(
  ({ hero, left, top, ...props }, ref) => {
    return (
      <div
        className="absolute"
        ref={ref}
        {...props}
        style={{ left: left, top: top }}
      >
        <Image
          src={hero}
          width={50}
          height={117}
          alt="planet"
          className="object-cover"
        />
      </div>
    );
  },
);

// Set the display name for better debugging
Hero.displayName = "Hero";

export default Hero;
