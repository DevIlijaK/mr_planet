"use client";

import Image, { type StaticImageData } from "next/image";
import { useState, useEffect, type FC } from "react";

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
import useCoarsePointer from "~/hooks/use-coarse-pointer";
import { pickIndex } from "~/lib/planet";
import Hero from "./hero";
import { GameLoopProvider } from "./providers/game-loop-context";
import { SpaceProvider } from "./providers/space-provider";
import { PhysicsContextProvider } from "./providers/physics-provider";
import { PressedKeysProvider } from "./providers/pressed-keys-provider";
import { BottomRamp } from "./bottom-ramp";
import { HeroSizeProvider } from "./providers/hero-size-provider";
import { TouchControls } from "./touch-controls";

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
export function getPlanetFor(slug: string): StaticImageData {
  return planets[pickIndex(slug, planets.length)]!;
}

/** What the post needs to be a planet. The body stays on the server. */
export type PlanetPost = {
  slug: string;
  title: string;
  excerpt: string;
};

/**
 * How many worlds fit on screen before the level stops reading as a level. The
 * grid is one column on a phone and three on a desktop, so this is really a
 * row count in disguise.
 */
function visibleCount(width: number) {
  if (width < 640) return 3;
  if (width < 1024) return 6;
  return 9;
}

export const BlogGrid: FC<{ posts: PlanetPost[] }> = ({ posts }) => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const size = useScreenSize();
  const onTouch = useCoarsePointer();

  useEffect(() => {
    setScreenSize(size);
  }, [size]);

  // Held back until the width is known on the client: the level is laid out in
  // rows that have to match the collision surfaces the physics measures.
  if (screenSize === null) {
    return null;
  }

  const visible = posts.slice(0, visibleCount(screenSize));

  return (
    <div className="game-viewport relative flex w-full flex-col justify-between overflow-hidden align-middle">
      <Image
        priority
        sizes="100dvw"
        src={bg}
        alt=""
        aria-hidden
        className="pixelated -z-50 object-cover object-center"
        fill
      />
      <SpaceProvider>
        {/* overscroll-contain: on a phone, a swipe that runs past the end of
            this list must not hand the scroll to the page and drag the whole
            scene around. */}
        <div className="grid h-[90dvh] w-full grid-cols-1 gap-y-[2.5dvh] overflow-auto overscroll-contain px-[6dvw] py-[5dvh] sm:grid-cols-2 sm:gap-x-[6dvw] sm:px-[4dvw] lg:grid-cols-3 lg:gap-x-[5dvw]">
          {visible.map((post) => (
            <PlanetCart
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              planet={getPlanetFor(post.slug)}
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
            {/* Outside the game loop — it only ever writes input — but inside
                the key provider, so a thumb and a keyboard reach the hero by
                exactly the same route. */}
            {onTouch && <TouchControls />}
          </PressedKeysProvider>
        </PhysicsContextProvider>
      </SpaceProvider>
    </div>
  );
};
