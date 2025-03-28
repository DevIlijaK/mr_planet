import Image, { type StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";
import meteor from "../../public/images/meteors/Meteor_01.png";
import meteor2 from "../../public/images/meteors/Meteor_02.png";
import meteor3 from "../../public/images/meteors/Meteor_03.png";
import meteor4 from "../../public/images/meteors/Meteor_04.png";
import meteor5 from "../../public/images/meteors/Meteor_05.png";
import meteor6 from "../../public/images/meteors/Meteor_06.png";
import meteor7 from "../../public/images/meteors/Meteor_07.png";
import meteor8 from "../../public/images/meteors/Meteor_08.png";
import meteor9 from "../../public/images/meteors/Meteor_09.png";
import meteor10 from "../../public/images/meteors/Meteor_10.png";
import useScreenSize from "~/hooks/use-screen-size";
import { useSpace } from "./providers/space-provider";
import { cn } from "~/lib/utils";

const meteors: StaticImageData[] = [
  meteor,
  meteor2,
  meteor3,
  meteor4,
  meteor5,
  meteor6,
  meteor7,
  meteor8,
  meteor9,
  meteor10,
];

export function getRandomMeteor(): StaticImageData {
  const randomIndex = Math.floor(Math.random() * meteors.length);
  return meteors[randomIndex]!;
}

interface PlanetCartProps {
  planet: StaticImageData;
  content: string;
}

export const PlanetCart: React.FC<PlanetCartProps> = ({ planet, content }) => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const size = useScreenSize();
  const rampRef = useRef<HTMLDivElement>(null);
  const { rampRefs } = useSpace();

  useEffect(() => {
    if (rampRef.current) {
      rampRefs.current?.push(rampRef.current);
    }
  }, [rampRef, rampRefs]);

  useEffect(() => {
    setScreenSize(size);
  }, [size]);

  const numberOfAsteroids =
    screenSize !== null
      ? screenSize < 640
        ? 12
        : screenSize < 1024
          ? 9
          : 8
      : 8;

  return (
    <div className="flex h-[25dvh] w-[80dvw] flex-col justify-between rounded-3xl bg-transparent align-middle sm:w-[40dvw] lg:w-[25dvw]">
      <div className="flex h-full w-full">
        <div className="flex items-start justify-start">
          <div className="h-[10dvh] w-[10dvh] flex-shrink-0">
            <Image src={planet} alt="planet" className="object-cover" />
          </div>
          <div className="h-[20dvh] overflow-hidden">
            <h1 className="m-0 text-sm font-medium">Testiranje kaskjdalsd</h1>
            <p className="text-xs font-light">
              {content.split(" ").slice(0, 30).join(" ")}
            </p>
          </div>
        </div>
      </div>
      <div ref={rampRef} className="flex h-[5dvh] items-end justify-between">
        {Array.from({ length: numberOfAsteroids }).map((_, index) => (
          <div
            key={index}
            className={cn(
              "flex h-[5dvh] w-[5dvh]",
              index % 2 === 0 ? "items-end" : "items-start",
            )}
          >
            <Image
              src={getRandomMeteor()}
              alt={`asteroid-${index}`}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
