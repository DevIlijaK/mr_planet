import { useCallback, useEffect, useRef, useState } from "react";

import hero from "../../public/images/hero/mr-planet.png";
import runRight from "../../public/images/hero/run-right.gif";
import runLeft from "../../public/images/hero/run-left.gif";
import jumpRight from "../../public/images/hero/jump-left.png";
import jumpLeft from "../../public/images/hero/jump-right.png";
import { type StaticImageData } from "next/image";
import Hero from "./hero";
import { usePressedKeysContext } from "./providers/pressed-keys-provider";
import { usePhysicsContext } from "./providers/physics-provider";
import { useMovementContext } from "./providers/movement-provider";

const counter = 0;

export const GameLoop = () => {
  const {
    step,
    screenHeight,
    screenWidth,
    gravitationVelocity,
    setGravitationVelocity,
  } = usePhysicsContext();

  const { pressedKeys } = usePressedKeysContext();
  const {
    isMoving,
    setIsMoving,
    isJumping,
    setIsJumping,
    maxHeight,
    setMaxHeight,
    jumpingAnimation,
    addJumpingAnimation,
  } = useMovementContext();

  const [heroImage, setHeroImage] = useState<StaticImageData>(hero);
  const [heroLeft, setHeroLeft] = useState<number>(50);
  const [heroTop, setHeroTop] = useState<number>(50);
  const [heroWidth, setHeroWidth] = useState<number>(50);
  const [heroHeight, setHeroHeight] = useState<number>(117);
  const [isTouchingSides, setIsTouchingSides] = useState<boolean>(false);
  const [isDynamicPictureActive, setIsDynamicPictureActive] =
    useState<boolean>(false);

  const [initialVelocityX, setInitialVelocityX] = useState<number>(0);
  const [initialVelocityY, setInitialVelocityY] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(0);
  const [initialX, setInitialX] = useState<number>(0);
  const [jumpVelocity, setJumpVelocity] = useState<number>(0.2);
  const [standingElement, setStandingElement] = useState<undefined>(undefined);

  const gravity = 0.00000005;
  const heroRef = useRef<HTMLDivElement | null>(null);
  const animationFrameId = useRef<number | null>(null); // useRef to track the animation frame ID

  useEffect(() => {
    if (heroLeft <= 0) {
      setHeroLeft(0);
      setIsTouchingSides(true);
    } else if (heroLeft + heroWidth >= screenWidth) {
      setHeroLeft(screenWidth - heroWidth);
      setIsTouchingSides(true);
    } else {
      setIsTouchingSides(false);
    }
  }, [heroLeft, heroWidth, screenWidth]);

  const throwAnimation = useCallback(() => {
    console.log("----- throwAnimation START -----");

    const gravitationVelocityLocal =
      gravitationVelocity + 0.5 * gravity * Math.pow(time, 2);
    // console.log("gravitationVelocityLocal:", gravitationVelocityLocal);

    const heroTopLocal =
      initialY - initialVelocityY * time + gravitationVelocityLocal;
    // console.log("heroTopLocal (calculated):", heroTopLocal);

    if (!isTouchingSides) {
      console.log("Is touching sides: ", isTouchingSides);
      setHeroLeft(Math.round(initialX - initialVelocityX * time));
      //   console.log(
      //     "Hero moving left, new heroLeft:",
      //     Math.round(heroTop - initialVelocityX * time),
      //   );
    }

    const timeLocal = time + 1;
    console.log("timeLocal:", timeLocal);

    if (heroTopLocal + heroHeight <= maxHeight) {
      setMaxHeight(heroTopLocal + heroHeight);
      console.log("New maxHeight set:", heroTopLocal + heroHeight);
    }

    // Logs for important state and variables
    // console.log("Local heroTop:", heroTopLocal);
    // console.log("Current heroTop state:", heroTop);
    // console.log("Initial Y velocity:", initialVelocityY);
    // console.log("Time:", time);
    // console.log("Gravitation velocity local:", gravitationVelocityLocal);
    // console.log("");

    // Update states
    setHeroLeft((initialX) => {
      const newHeroLeft = initialX - initialVelocityX * timeLocal;
      //   console.log("New heroLeft (calculated):", newHeroLeft);
      return newHeroLeft;
    });

    setGravitationVelocity(gravitationVelocityLocal);
    // console.log("gravitationVelocity unchanged, set to:", gravitationVelocity);

    setHeroTop(heroTopLocal);
    // console.log("heroTop set to heroTopLocal:", heroTopLocal);

    setTime(timeLocal);
    // console.log("time set to timeLocal:", timeLocal);

    console.log("----- throwAnimation END -----");
  }, [
    gravitationVelocity,
    heroHeight,
    initialVelocityX,
    initialVelocityY,
    initialX,
    initialY,
    isTouchingSides,
    maxHeight,
    setGravitationVelocity,
    setMaxHeight,
    time,
  ]);

  const obliqueThrowConfig = useCallback(
    (angle: number, key: string) => {
      console.log("----- obliqueThrowConfig START -----");
      //   console.log("angle:", angle);
      //   console.log("key:", key);

      //   console.log("isJumping set to true");

      setInitialX(heroLeft);
      setInitialY(heroTop);
      //   console.log("initialX set to:", heroLeft);
      //   console.log("initialY set to:", heroTop);

      const angleInRadians = (angle * Math.PI) / 180;
      //   console.log("angleInRadians:", angleInRadians);

      //   console.log("jumpVelocity:", jumpVelocity);
      //   console.log("Math.cos(angleInRadians):", Math.cos(angleInRadians));
      //   console.log("Math.sin(angleInRadians):", Math.sin(angleInRadians));

      setInitialVelocityX(jumpVelocity * Math.cos(angleInRadians));
      //   console.log(
      //     "initialVelocityX set to:",
      //     jumpVelocity * Math.cos(angleInRadians),
      //   );

      setInitialVelocityY(jumpVelocity * Math.sin(angleInRadians));
      //   console.log(
      //     "initialVelocityY set to:",
      //     jumpVelocity * Math.sin(angleInRadians),
      //   );

      setGravitationVelocity(0);
      //   console.log("gravitationVelocity set to: 0");

      addJumpingAnimation(key);
      //   console.log("addJumpingAnimation called with key:", key);

      setStandingElement(undefined);
      //   console.log("standingElement set to undefined");

      setIsJumping(true);

      console.log("----- obliqueThrowConfig END -----");
    },
    [
      addJumpingAnimation,
      heroLeft,
      heroTop,
      jumpVelocity,
      setGravitationVelocity,
      setIsJumping,
    ],
  );

  const moveHero = useCallback(() => {
    if (
      (pressedKeys.has("a") && pressedKeys.has("w")) ||
      jumpingAnimation.has("aw")
    ) {
      if (!isJumping) {
        obliqueThrowConfig(45, "aw");
        setHeroImage(jumpLeft);
        setIsDynamicPictureActive(true);
      }
      throwAnimation();
    } else if (
      (pressedKeys.has("d") && pressedKeys.has("w")) ||
      jumpingAnimation.has("dw")
    ) {
      if (!isJumping) {
        obliqueThrowConfig(125, "dw");
        setHeroImage(jumpRight);
        setIsDynamicPictureActive(true);
      }
    } else {
      if ((!isJumping && pressedKeys.has("w")) || jumpingAnimation.has("w")) {
        if (!isJumping) {
          obliqueThrowConfig(90, "w");
          setHeroImage(hero);
        }
      }
      if (pressedKeys.has("d")) {
        setHeroLeft((prev) => prev + step);
        if (!isDynamicPictureActive) {
          setHeroImage(runRight);
          setIsDynamicPictureActive(true);
        }
      } else if (pressedKeys.has("a")) {
        setHeroLeft((prev) => prev - step);
        if (!isDynamicPictureActive) {
          setHeroImage(runLeft);
          setIsDynamicPictureActive(true);
        }
      } else if (pressedKeys.size === 0) {
        setHeroImage(hero);
        setIsDynamicPictureActive(false);
      }
    }

    animationFrameId.current = requestAnimationFrame(moveHero);
  }, [
    isDynamicPictureActive,
    isJumping,
    jumpingAnimation,
    obliqueThrowConfig,
    pressedKeys,
    step,
    throwAnimation,
  ]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(moveHero);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [moveHero]);

  useEffect(() => {
    if (heroRef.current) {
      setHeroHeight(heroRef.current?.offsetHeight);
      setHeroWidth(heroRef.current?.offsetWidth);
    }
  }, []);

  useEffect(() => {
    if (isJumping) {
      throwAnimation();
    }
  }, [isJumping, throwAnimation]);

  return <Hero ref={heroRef} hero={heroImage} top={heroTop} left={heroLeft} />;
};
