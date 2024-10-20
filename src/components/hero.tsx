"use client";
import Image from "next/image";

import { useGameLoop } from "./providers/game-loop-context";
import { useSpace } from "./providers/space-provider";
import { motion, useAnimate } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import heroStatic from "../../public/images/hero/mr-planet.png";
import { usePhysicsContext } from "./providers/physics-provider";

const Hero = () => {
  const {
    setHeroLeft,
    setHeroTop,
    heroImage,
    heroTop,
    heroLeft,
    heroHeight,
    heroWidth,
  } = useGameLoop();
  const { initialX, initialY } = usePhysicsContext();
  const [animationFinished, setAnimationFinished] = useState<boolean>(false);
  const { heroRef } = useSpace();
  const topValue = `calc(90vh - ${heroHeight}px)`;

  const [scope, animate] = useAnimate();

  const myAnimation = useCallback(async () => {
    // await animate(scope.current, { rotate: -90 });
    // await animate(scope.current, { scale: 1.5 });
    // await animate(scope.current, { rotate: 0 });
    // await animate(scope.current, { scale: 1 });

    const rotationAnimation = animate(
      scope.current,
      { rotate: 360 },
      {
        repeat: Infinity,
        ease: "linear",
        duration: 2,
      },
    );

    // Move to the left (start of the screen)
    await animate(scope.current, { x: "0vw" }, { duration: 3 });

    // Move to the right (end of the screen)
    await animate(scope.current, { x: "100vw" }, { duration: 3 });

    await animate(
      scope.current,
      {
        top: "0%", // Move vertically to the top
        left: "-50%", // Stay centered horizontally
        translateX: "-50%", // Keep the element centered horizontally
      },
      { duration: 3 },
    );

    // Move to the bottom-middle (centered horizontally and at the bottom of the screen)
    rotationAnimation.stop();
    await animate(
      scope.current,
      { rotate: 0 },
      {
        duration: 1,
      },
    );

    await animate(scope.current, {
      top: topValue,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const { left, top } = scope.current.getBoundingClientRect() as {
      left: number;
      top: number;
    };
    initialX.current = top;
    initialY.current = left;
    setHeroLeft(left);
    setHeroTop(top);
    setAnimationFinished(true);
    // animate(
    //   scope.current,
    //   { x: 100 },
    //   {
    //     repeat: Infinity,
    //     repeatType: "mirror",
    //     ease: "easeInOut",
    //     duration: 1,
    //   },
    // );
  }, [animate, initialX, initialY, scope, setHeroLeft, setHeroTop, topValue]);

  useEffect(() => {
    void myAnimation();
  }, [myAnimation]); // Add myAnimation as a dependency

  return (
    heroRef &&
    (animationFinished ? (
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
    ) : (
      <motion.div className="absolute top-1/2" ref={scope}>
        <Image
          unoptimized
          src={heroStatic}
          width={heroWidth}
          height={heroHeight}
          alt="planet"
          className="object-cover"
        />
      </motion.div>
    ))
  );
};

export default Hero;
