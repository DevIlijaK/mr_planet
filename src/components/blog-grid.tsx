"use client";

import Image, { type StaticImageData } from "next/image";
import { PlanetCart } from "./planet-cart";
import bg from "../../public/images/background.gif";
import planet from "../../public/images/planets/planet.png";
import planet1 from "../../public/images/planets/planet1.png";
import planet2 from "../../public/images/planets/planet2.png";
import planet3 from "../../public/images/planets/planet3.png";
import planet4 from "../../public/images/planets/planet4.png";
import planet5 from "../../public/images/planets/planet5.png";
import planet6 from "../../public/images/planets/planet6.png";
import planet7 from "../../public/images/planets/planet7.png";
import planet8 from "../../public/images/planets/planet8.png";
import planet9 from "../../public/images/planets/planet9.png";
import useScreenSize from "~/hooks/use-screen-size";

const planets: StaticImageData[] = [
  planet,
  planet1,
  planet2,
  planet3,
  planet4,
  planet5,
  planet6,
  planet7,
  planet8,
  planet9,
];

export function getRandomPlanet(): StaticImageData {
  const randomIndex = Math.floor(Math.random() * planets.length);
  const test = planets[randomIndex]!;
  return test;
}

import { useState, useEffect, type FC } from "react";
import Hero from "./hero";
import { GameLoopProvider } from "./providers/game-loop-context";
import { SpaceProvider } from "./providers/space-provider";
import { MovementProvider } from "./providers/movement-provider";
import { PhysicsContextProvider } from "./providers/physics-provider";
import { PressedKeysProvider } from "./providers/pressed-keys-provider";
import { BottomRamp } from "./bottom-ramp";
import { HeroSizeProvider } from "./providers/hero-size-provider";

export const BlogGrid: FC = () => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const size = useScreenSize();
  let numberOfPlanets = 9;

  useEffect(() => {
    setScreenSize(size);
  }, [size]);

  if (screenSize === null) {
    return null;
  }

  if (screenSize < 640) {
    numberOfPlanets = 3;
  } else if (screenSize < 1024) {
    numberOfPlanets = 6;
  }

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden align-middle">
      <Image
        priority
        sizes="100vw"
        src={bg}
        alt="background-image"
        className="-z-50 h-screen w-full object-cover object-center"
        fill
      />
      <SpaceProvider>
        <div className="grid h-[90vh] w-full grid-cols-1 gap-y-[2.5vh] overflow-auto px-[10vw] py-[5vh] sm:grid-cols-2 sm:gap-x-[10vw] sm:px-[5vw] lg:grid-cols-3 lg:gap-x-[7.5vw]">
          {Array.from({ length: numberOfPlanets }).map((_, index) => (
            <PlanetCart key={index} planet={getRandomPlanet()} />
          ))}
        </div>
        <BottomRamp />
        <PhysicsContextProvider>
          <MovementProvider>
            <PressedKeysProvider>
              <HeroSizeProvider>
                <GameLoopProvider>
                  <Hero />
                </GameLoopProvider>
              </HeroSizeProvider>
            </PressedKeysProvider>
          </MovementProvider>
        </PhysicsContextProvider>
      </SpaceProvider>
    </div>
  );
};
