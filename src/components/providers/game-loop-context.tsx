import { type StaticImageData } from "next/image";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useMovementContext } from "./movement-provider";
import { usePhysicsContext } from "./physics-provider";
import { usePressedKeysContext } from "./pressed-keys-provider";
import hero from "../../../public/images/hero/mr-planet.png";
import runRight from "../../../public/images/hero/run-right.gif";
import runLeft from "../../../public/images/hero/run-left.gif";
import jumpRight from "../../../public/images/hero/jump-right.png";
import jumpLeft from "../../../public/images/hero/jump-left.png";
import { useSpace } from "./space-provider";
import { useHeroSize } from "./hero-size-provider";

// Define the context and its shape
interface GameLoopContextType {
  heroImage: StaticImageData;
  heroLeft: number;
  heroTop: number;
  showTeleportModal: boolean;
  setHeroTop: Dispatch<SetStateAction<number>>;
  setHeroLeft: Dispatch<SetStateAction<number>>;
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
    gravity,
    gravitationVelocity,
    jumpVelocity,
    setGravitationVelocity,
    initialX,
    initialY,
  } = usePhysicsContext();

  const { heroWidth, heroHeight } = useHeroSize();

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
    isDynamicPictureActive,
  } = useMovementContext();
  const [heroImage, setHeroImage] = useState<StaticImageData>(hero);
  const [heroLeft, setHeroLeft] = useState<number>(50);
  const [heroTop, setHeroTop] = useState<number>(500);
  const [showTeleportModal, setShowTeleportModal] = useState<boolean>(false);
  const initialVelocityX = useRef<number>(0);
  const initialVelocityY = useRef<number>(0);
  const time = useRef<number>(0);
  const isTouchingSides = useRef<boolean>(false);
  const { rampRefs, standingElement } = useSpace();

  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    if (heroLeft <= 0) {
      setHeroLeft(0);
      isTouchingSides.current = true;
    } else if (heroLeft + heroWidth >= screenWidth) {
      setHeroLeft(screenWidth - heroWidth);
      isTouchingSides.current = true;
    } else {
      isTouchingSides.current = false;
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
        // console.log("Platforma: ", rect);
        // console.log("Hero visina: ", heroHeight);
        // console.log("Hero top: ", heroTop);
        // console.log("Platforma top - hero visina: ", rect.top - heroHeight);
        setHeroTop(rect.top - heroHeight);
        setMaxHeight(rect.top);
        time.current = 1;
        setGravitationVelocity(0);
        standingElement.current = { dimension: rect, platform: ramp };

        setHeroImage(hero);
        isDynamicPictureActive.current = false;

        // isFalling = false;
        setIsJumping(false);
        setShowTeleportModal(true);
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
    isDynamicPictureActive,
    jumpingAnimation,
    maxHeight,
    rampRefs,
    setGravitationVelocity,
    setIsJumping,
    setMaxHeight,
    standingElement,
  ]);

  const throwAnimation = useCallback(() => {
    // console.log("----- throwAnimation START -----");
    // console.log("Velocity: ", gravitationVelocity);
    if (gravity) {
      const gravitationVelocityLocal =
        gravitationVelocity + 0.5 * gravity * Math.pow(time.current, 2);
      // console.log("gravitationVelocityLocal:", gravitationVelocityLocal);

      const heroTopLocal =
        initialY.current -
        initialVelocityY.current * time.current +
        gravitationVelocityLocal;
      // console.log("heroTopLocal (calculated):", heroTopLocal);

      if (!isTouchingSides.current) {
        // console.log("Is touching sides: ", isTouchingSides);
        setHeroLeft(
          Math.round(
            initialX.current - initialVelocityX.current * time.current,
          ),
        );
        //   console.log(
        //     "Hero moving left, new heroLeft:",
        //     Math.round(heroTop - initialVelocityX * time),
        //   );
      }
      time.current += 1.5;
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
      setHeroLeft((heroLeft) => {
        const newHeroLeft = heroLeft - initialVelocityX.current * time.current;
        //   console.log("New heroLeft (calculated):", newHeroLeft);
        return newHeroLeft;
      });

      setGravitationVelocity(gravitationVelocityLocal);
      // console.log("gravitationVelocity unchanged, set to:", gravitationVelocity);

      setHeroTop(heroTopLocal);
      // console.log("heroTop set to heroTopLocal:", heroTopLocal);

      // console.log("time set to timeLocal:", timeLocal);

      // console.log("----- throwAnimation END -----");
    }
  }, [
    gravitationVelocity,
    gravity,
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

      // console.log("iNITIAL X JE: ", initialX);

      initialX.current = heroLeft;
      initialY.current = heroTop;

      initialVelocityX.current = jumpVelocity * Math.cos(angleInRadians);
      //   console.log(
      //     "initialVelocityX set to:",
      //     jumpVelocity * Math.cos(angleInRadians),
      //   );

      initialVelocityY.current = jumpVelocity * Math.sin(angleInRadians);
      //   console.log(
      //     "initialVelocityY set to:",
      //     jumpVelocity * Math.sin(angleInRadians),
      //   );

      setGravitationVelocity(0);
      //   console.log("gravitationVelocity set to: 0");

      addJumpingAnimation(key);
      //   console.log("addJumpingAnimation called with key:", key);

      standingElement.current = null;
      //   console.log("standingElement set to undefined");

      setIsJumping(true);

      //   console.log("----- obliqueThrowConfig END -----");
    },
    [
      addJumpingAnimation,
      heroLeft,
      heroTop,
      initialX,
      initialY,
      jumpVelocity,
      setGravitationVelocity,
      setIsJumping,
      standingElement,
    ],
  );

  const checkStandingElements = useCallback(() => {
    // console.log("Standing element je: ", standingElement);
    if (standingElement.current) {
      // console.log("top je: ", standingElement.current.dimension.left <= );
      // console.log('Hero top je: ', heroTop)
      // console.log('Hero height je: ', heroHeight)
      // console.log(
      //   "standingElement.dimension.left <= heroLeft + heroWidth",
      //   standingElement.current.dimension.left <= heroLeft + heroWidth,
      // );
      // console.log(
      //   "standingElement.dimension.left + standingElement.dimension.width >= heroLeft",
      //   standingElement.current.dimension.left +
      //     standingElement.current.dimension.width >=
      //     heroLeft,
      // );
      if (
        standingElement.current.dimension.left <= heroLeft + heroWidth &&
        standingElement.current.dimension.left +
          standingElement.current.dimension.width >=
          heroLeft
      ) {
        // if (pressedKeys.has("k")) {
        //   enterBlog(standingElement);
        //   isMoving = false;
        // }
        // if (standingElement.current?.platform?.id !== "footer") {
        //   heroDirectionsContainer.style.visibility = "visible";
        //   heroDirectionsContainer.onclick = teleportInsideBlog;
        //   heroDirectionsContainer.innerText = "TP u BLOG";
        // }
        // isFalling = false;
      } else {
        if (pressedKeys.has("d")) {
          console.log("Ulazi ovde", isJumping);
          if (!isJumping) {
            console.log("Ulazi ovde");
            obliqueThrowConfig(260, "d");
            setHeroImage(jumpRight);
          }
          // gravityConfig(3.14159);
        } else if (pressedKeys.has("a")) {
          if (!isJumping) {
            obliqueThrowConfig(280, "a");
            setHeroImage(jumpLeft);
          }
        }
        throwAnimation();
        // heroDirectionsContainer.style.visibility = "hidden";
      }
    } else {
      setShowTeleportModal(false);
      // heroDirectionsContainer.style.visibility = "hidden";
    }
  }, [
    heroLeft,
    heroWidth,
    isJumping,
    obliqueThrowConfig,
    pressedKeys,
    standingElement,
    throwAnimation,
  ]);

  const moveHero = useCallback(() => {
    // console.log("Is active: ", !isDynamicPictureActive);
    if (
      (pressedKeys.has("a") && pressedKeys.has("w")) ||
      jumpingAnimation.has("aw")
    ) {
      if (!isJumping) {
        obliqueThrowConfig(45, "aw");
        setHeroImage(jumpLeft);
        isDynamicPictureActive.current = true;
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
        isDynamicPictureActive.current = true;
      }

      throwAnimation();
    } else {
      // console.log("Uslo ovde 5555555555555https://forms.gle/GyCf5XAZpjZMkhHw7");
      if (
        (!isJumping && pressedKeys.has("w")) ||
        jumpingAnimation.has("w") ||
        jumpingAnimation.has("a") ||
        jumpingAnimation.has("d")
      ) {
        if (!isJumping) {
          obliqueThrowConfig(90, "w");
          setHeroImage(hero);
          isDynamicPictureActive.current = true;
          // console.log("Uslo ovde");
        }
        throwAnimation();
      } else if (pressedKeys.has("d")) {
        setHeroLeft((prev) => prev + step);
        // console.groupCollapsed("pressedKeys.has(d) ", pressedKeys.has("d"));
        // console.log("Dynamic is: ", !isDynamicPictureActive);
        if (!isDynamicPictureActive.current) {
          // console.groupCollapsed("Uslo ovde run right: ", runRight);
          setHeroImage(runRight);

          isDynamicPictureActive.current = true;
        }
      } else if (pressedKeys.has("a")) {
        setHeroLeft((prev) => prev - step);
        if (!isDynamicPictureActive.current) {
          setHeroImage(runLeft);
          isDynamicPictureActive.current = true;
        }
      } else if (pressedKeys.size === 0) {
        setHeroImage(hero);
        isDynamicPictureActive.current = false;
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
    checkStandingElements();
  }, [heroTop, heroLeft, rampCollisionDetection, checkStandingElements]);

  return (
    <GameLoopContext.Provider
      value={{
        heroImage,
        heroLeft,
        heroTop,
        showTeleportModal,
        setHeroTop,
        setHeroLeft,
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
