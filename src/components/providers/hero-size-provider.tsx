import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useScreenSize from "~/hooks/use-screen-size";

interface HeroSizeContextType {
  heroWidth: number;
  heroHeight: number;
}

// Create the context with default values
const HeroSizeContext = createContext<HeroSizeContextType | undefined>(
  undefined,
);

export const HeroSizeProvider = ({ children }: { children: ReactNode }) => {
  const [heroWidth, setHeroWidth] = useState<number>(50);
  const [heroHeight, setHeroHeight] = useState<number>(77);
  const size = useScreenSize();

  useEffect(() => {
    // The sprite is 150x231. Scaling by a whole-number divisor keeps every
    // source pixel the same size on screen; anything else makes the pixel art
    // shimmer once `image-rendering: pixelated` is on.
    const divisor = size < 640 ? 5 : size < 1024 ? 4 : 3;

    setHeroWidth(Math.round(150 / divisor));
    setHeroHeight(Math.round(231 / divisor));
  }, [size]);

  return (
    <HeroSizeContext.Provider
      value={{
        heroWidth,
        heroHeight,
      }}
    >
      {children}
    </HeroSizeContext.Provider>
  );
};

export const useHeroSize = (): HeroSizeContextType => {
  const context = useContext(HeroSizeContext);
  if (!context) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
};
