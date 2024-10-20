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
    if (size < 640) {
      //   150, 231;
      setHeroWidth(37.5);
      setHeroHeight(57.75);
    } else if (size < 1024) {
      setHeroWidth(37.5);
      setHeroHeight(57.75);
    }
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
