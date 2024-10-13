import Image, { type StaticImageData } from "next/image";
import React, { useEffect, useState } from "react";
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
}

export const PlanetCart: React.FC<PlanetCartProps> = ({ planet }) => {
  const [screenSize, setScreenSize] = useState<number | null>(null);
  const size = useScreenSize();
  let numberOfAsteroids = 8;

  useEffect(() => {
    setScreenSize(size);
  }, [size]);

  if (screenSize === null) {
    return null;
  }

  if (screenSize < 640) {
    numberOfAsteroids = 12;
  } else if (screenSize < 1024) {
    numberOfAsteroids = 9;
  }
  return (
    <div className="flex h-[25vh] w-[80vw] flex-col justify-between rounded-3xl border border-solid bg-transparent align-middle sm:w-[40vw] lg:w-[25vw]">
      <div className="flex h-full w-full p-2">
        <div className="flex items-start justify-start">
          <div className="h-[10vh] w-[10vh] flex-shrink-0">
            <Image src={planet} alt="planet" className="object-cover" />
          </div>
          <div>
            <h1>Testiranje kaskjdalsd</h1>
            <p>
              Testialksdjalksdj klasjakl acjalkj alkscja alksja aslkcja ls
              jaskjdalkj asclja a alk jajs j sa jkas kj akj kaj
            </p>
          </div>
        </div>
      </div>
      <div className="flex h-[5vh] justify-between">
        {Array.from({ length: numberOfAsteroids }).map((_, index) => (
          <div key={index} className="h-[5vh] w-[5vh]">
            <Image
              src={getRandomMeteor()}
              alt="planet"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
