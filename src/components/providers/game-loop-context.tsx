import { type StaticImageData } from "next/image";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useMovementContext } from "./movement-provider";
import { usePhysicsContext } from "./physics-provider";
import { usePressedKeysContext } from "./pressed-keys-provider";
import hero from "../../../public/images/hero/mr-planet.png";
import runRight from "../../../public/images/hero/run-right.gif";
import runLeft from "../../../public/images/hero/run-left.gif";
import jumpRight from "../../../public/images/hero/jump-left.png";
import jumpLeft from "../../../public/images/hero/jump-right.png";
import { useSpace } from "./space-provider";

// Define the context and its shape
interface GameLoopContextType {
  heroImage: StaticImageData;
  setHeroImage: React.Dispatch<React.SetStateAction<StaticImageData>>;
  heroLeft: number;
  setHeroLeft: React.Dispatch<React.SetStateAction<number>>;
  heroTop: number;
  setHeroTop: React.Dispatch<React.SetStateAction<number>>;
  heroWidth: number;
  setHeroWidth: React.Dispatch<React.SetStateAction<number>>;
  heroHeight: number;
  setHeroHeight: React.Dispatch<React.SetStateAction<number>>;
  isDynamicPictureActive: boolean;
  setIsDynamicPictureActive: React.Dispatch<React.SetStateAction<boolean>>;
  initialVelocityX: number;
  setInitialVelocityX: React.Dispatch<React.SetStateAction<number>>;
  initialVelocityY: number;
  setInitialVelocityY: React.Dispatch<React.SetStateAction<number>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  initialY: number;
  setInitialY: React.Dispatch<React.SetStateAction<number>>;
  initialX: number;
  setInitialX: React.Dispatch<React.SetStateAction<number>>;
  jumpVelocity: number;
  setJumpVelocity: React.Dispatch<React.SetStateAction<number>>;
  standingElement: any; // Replace 'any' with the appropriate type if known
  setStandingElement: React.Dispatch<React.SetStateAction<any>>;
  gravity: number;
  animationFrameId: React.RefObject<number | null>;
}

// Create the context
const GameLoopContext = createContext<GameLoopContextType | undefined>(
  undefined,
);

// Create a provider component
export const GameLoopProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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
  const [heroTop, setHeroTop] = useState<number>(500);
  const [heroWidth, setHeroWidth] = useState<number>(50);
  const [heroHeight, setHeroHeight] = useState<number>(77);
  const [isDynamicPictureActive, setIsDynamicPictureActive] =
    useState<boolean>(false);
  const [initialVelocityX, setInitialVelocityX] = useState<number>(0);
  const [initialVelocityY, setInitialVelocityY] = useState<number>(0);
  const [time, setTime] = useState<number>(0);
  const [initialY, setInitialY] = useState<number>(0);
  const [initialX, setInitialX] = useState<number>(0);
  const [jumpVelocity, setJumpVelocity] = useState<number>(5);
  const [standingElement, setStandingElement] = useState<undefined>(undefined);
  const [isTouchingSides, setIsTouchingSides] = useState<boolean>(false);
  const { rampRefs } = useSpace();

  const animationFrameId = useRef<number | null>(null);

  const gravity = 0.001;
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

  const rampCollisionDetection = useCallback(() => {
    rampRefs.current.forEach((ramp) => {
      const rect = ramp?.getBoundingClientRect();

      if (
        rect &&
        heroTop + heroHeight > rect.top &&
        heroTop < rect.top &&
        maxHeight <= rect.top &&
        rect.left <= heroLeft + heroWidth &&
        rect.left + rect.width >= heroLeft
      ) {
        // console.log("Ulazi ovde 11");
        console.log("Platforma: ", rect);
        console.log("Hero visina: ", heroHeight);
        console.log("Hero top: ", heroTop);
        console.log("Platforma top - hero visina: ", rect.top - heroHeight);
        setHeroTop(rect.top - heroHeight);
        setMaxHeight(rect.top);
        setTime(1);
        setGravitationVelocity(0);
        //   setStandingElement({ dimension: rect, platform: platforms[i] })

        setHeroImage(hero);
        setIsDynamicPictureActive(false);

        // isFalling = false;
        setIsJumping(false);
        jumpingAnimation.clear();
      }
      // else {
      //     isFalling = true;
      //     heroDirectionsContainer.style.visibility = 'hidden';
      // }
    });
  }, [
    heroHeight,
    heroLeft,
    heroTop,
    heroWidth,
    jumpingAnimation,
    maxHeight,
    rampRefs,
    setGravitationVelocity,
    setIsJumping,
    setMaxHeight,
  ]);

  const throwAnimation = useCallback(() => {
    // console.log("----- throwAnimation START -----");
    // console.log("Velocity: ", gravitationVelocity);
    const gravitationVelocityLocal =
      gravitationVelocity + 0.5 * gravity * Math.pow(time, 2);
    // console.log("gravitationVelocityLocal:", gravitationVelocityLocal);

    const heroTopLocal =
      initialY - initialVelocityY * time + gravitationVelocityLocal;
    // console.log("heroTopLocal (calculated):", heroTopLocal);

    if (!isTouchingSides) {
      // console.log("Is touching sides: ", isTouchingSides);
      setHeroLeft(Math.round(initialX - initialVelocityX * time));
      //   console.log(
      //     "Hero moving left, new heroLeft:",
      //     Math.round(heroTop - initialVelocityX * time),
      //   );
    }

    const timeLocal = time + 1.5;
    // console.log("timeLocal:", timeLocal);

    if (heroTopLocal + heroHeight <= maxHeight) {
      setMaxHeight(heroTopLocal + heroHeight);
      //   console.log("New maxHeight set:", heroTopLocal + heroHeight);
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

    // console.log("----- throwAnimation END -----");
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
      //   console.log("----- obliqueThrowConfig START -----");
      //   console.log("angle:", angle);
      //   console.log("key:", key);

      //   console.log("isJumping set to true");

      // setInitialX(heroLeft);
      // setInitialY(heroTop);
      //   console.log("initialX set to:", heroLeft);
      //   console.log("initialY set to:", heroTop);

      const angleInRadians = (angle * Math.PI) / 180;
      //   console.log("angleInRadians:", angleInRadians);

      //   console.log("jumpVelocity:", jumpVelocity);
      //   console.log("Math.cos(angleInRadians):", Math.cos(angleInRadians));
      //   console.log("Math.sin(angleInRadians):", Math.sin(angleInRadians));

      setInitialX(heroLeft);
      setInitialY(heroTop);

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

      //   console.log("----- obliqueThrowConfig END -----");
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
    // console.log("Is active: ", !isDynamicPictureActive);
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
      // console.log("Ulazi ovde asdsadasdasd");
      if (!isJumping) {
        obliqueThrowConfig(125, "dw");
        setHeroImage(jumpRight);
        setIsDynamicPictureActive(true);
      }

      throwAnimation();
    } else {
      // console.log("Uslo ovde 5555555555555https://forms.gle/GyCf5XAZpjZMkhHw7");
      if ((!isJumping && pressedKeys.has("w")) || jumpingAnimation.has("w")) {
        if (!isJumping) {
          obliqueThrowConfig(90, "w");
          setHeroImage(hero);

          console.log("Uslo ovde");
        }
        throwAnimation();
      }
      if (pressedKeys.has("d")) {
        setHeroLeft((prev) => prev + step);
        // console.groupCollapsed("pressedKeys.has(d) ", pressedKeys.has("d"));
        // console.log("Dynamic is: ", !isDynamicPictureActive);
        if (!isDynamicPictureActive) {
          // console.groupCollapsed("Uslo ovde run right: ", runRight);
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
    // rampCollisionDetection();
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

  //   useEffect(() => {
  //     if (heroRef.current) {
  //       setHeroHeight(heroRef.current?.offsetHeight);
  //       setHeroWidth(heroRef.current?.offsetWidth);
  //     }
  //   }, []);

  //   useEffect(() => {
  //     if (isJumping) {
  //       throwAnimation();
  //     }
  //   }, [isJumping, throwAnimation]);
  useEffect(() => {
    rampCollisionDetection();
  }, [heroTop, heroLeft, rampCollisionDetection]);

  return (
    <GameLoopContext.Provider
      value={{
        heroImage,
        setHeroImage,
        heroLeft,
        setHeroLeft,
        heroTop,
        setHeroTop,
        heroWidth,
        setHeroWidth,
        heroHeight,
        setHeroHeight,
        isDynamicPictureActive,
        setIsDynamicPictureActive,
        initialVelocityX,
        setInitialVelocityX,
        initialVelocityY,
        setInitialVelocityY,
        time,
        setTime,
        initialY,
        setInitialY,
        initialX,
        setInitialX,
        jumpVelocity,
        setJumpVelocity,
        standingElement,
        setStandingElement,
        gravity,
        animationFrameId,
      }}
    >
      {children}
    </GameLoopContext.Provider>
  );
};

// Create a custom hook to use the HeroContext
export const useGameLoop = (): GameLoopContextType => {
  const context = useContext(GameLoopContext);
  if (!context) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
};
