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
import { pickIndex } from "~/lib/blog-preview";

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

/** Stable per post, so a world doesn't change colour on every re-render. */
export function getPlanetFor(id: string): StaticImageData {
  return planets[pickIndex(id, planets.length)]!;
}

import { useState, useEffect, type FC } from "react";
import Hero from "./hero";
import { GameLoopProvider } from "./providers/game-loop-context";
import { SpaceProvider } from "./providers/space-provider";
import { PhysicsContextProvider } from "./providers/physics-provider";
import { PressedKeysProvider } from "./providers/pressed-keys-provider";
import { BottomRamp } from "./bottom-ramp";
import { HeroSizeProvider } from "./providers/hero-size-provider";
import { type SelectBlog } from "~/server/db/schema";
import { getBlogs } from "~/server/queries";

export const BlogGrid: FC = () => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const [blogs, setBlogs] = useState<SelectBlog[] | undefined>(undefined);
  const size = useScreenSize();

  useEffect(() => {
    setScreenSize(size);

    const fetchBlogs = async () => {
      let limit;
      if (size < 640) {
        limit = 3;
      } else if (size < 1024) {
        limit = 6;
      } else {
        limit = 9;
      }
      const response = await getBlogs({ limit });
      setBlogs(response);
    };
    void fetchBlogs();
  }, [size]);

  if (screenSize === null) {
    return null;
  }

  return (
    <div className="relative flex h-screen w-full flex-col justify-between overflow-hidden align-middle">
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt=""
        aria-hidden
        className="pixelated -z-50 h-screen w-full object-cover object-center"
        fill
      />
      <SpaceProvider>
        <div className="grid h-[90dvh] w-full grid-cols-1 gap-y-[2.5dvh] overflow-auto px-[6dvw] py-[5dvh] sm:grid-cols-2 sm:gap-x-[6dvw] sm:px-[4dvw] lg:grid-cols-3 lg:gap-x-[5dvw]">
          {blogs?.map((blog) => (
            <PlanetCart
              key={blog.id}
              id={blog.id}
              content={blog.content}
              planet={getPlanetFor(blog.id)}
            />
          ))}
        </div>
        <BottomRamp />
        <PhysicsContextProvider>
          <PressedKeysProvider>
            <HeroSizeProvider>
              <GameLoopProvider>
                <Hero />
              </GameLoopProvider>
            </HeroSizeProvider>
          </PressedKeysProvider>
        </PhysicsContextProvider>
      </SpaceProvider>
    </div>
  );
};
