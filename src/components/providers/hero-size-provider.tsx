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

// Create a provider component
export const HeroSizeProvider = ({ children }: { children: ReactNode }) => {
  const [heroWidth, setHeroWidth] = useState<number>(50);
  const [heroHeight, setHeroHeight] = useState<number>(77);
  const size = useScreenSize();

  useEffect(() => {
    const baseWidth = 75;
    const baseHeight = 115.5;

    let scaleFactor = 1;
    if (size < 640) {
      scaleFactor = 0.4;
    } else if (size < 1024) {
      scaleFactor = 0.75;
    }

    setHeroWidth(baseWidth * scaleFactor);
    setHeroHeight(baseHeight * scaleFactor);
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
