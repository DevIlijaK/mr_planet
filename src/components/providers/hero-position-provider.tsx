import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

// Define the shape of your context
interface HeroContextType {
  heroLeft: number;
  setHeroLeft: React.Dispatch<React.SetStateAction<number>>;
  heroTop: number;
  setHeroTop: React.Dispatch<React.SetStateAction<number>>;
  heroWidth: number;
  setHeroWidth: React.Dispatch<React.SetStateAction<number>>;
  heroHeight: number;
  setHeroHeight: React.Dispatch<React.SetStateAction<number>>;
}

// Create the context with default values
const HeroContext = createContext<HeroContextType | undefined>(undefined);

// Create a provider component
export const HeroProvider = ({ children }: { children: ReactNode }) => {
  const [heroLeft, setHeroLeft] = useState<number>(50);
  const [heroTop, setHeroTop] = useState<number>(50);
  const [heroWidth, setHeroWidth] = useState<number>(50);
  const [heroHeight, setHeroHeight] = useState<number>(117);

  return (
    <HeroContext.Provider
      value={{
        heroLeft,
        setHeroLeft,
        heroTop,
        setHeroTop,
        heroWidth,
        setHeroWidth,
        heroHeight,
        setHeroHeight,
      }}
    >
      {children}
    </HeroContext.Provider>
  );
};

export const useHero = (): HeroContextType => {
  const context = useContext(HeroContext);
  if (!context) {
    throw new Error("useHero must be used within a HeroProvider");
  }
  return context;
};
