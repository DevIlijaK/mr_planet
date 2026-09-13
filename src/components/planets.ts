import { type StaticImageData } from "next/image";
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
import { pickIndex } from "~/lib/pick";

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
export function planetFor(id: string): StaticImageData {
  return planets[pickIndex(id, planets.length)]!;
}
