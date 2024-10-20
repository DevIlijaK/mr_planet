import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface SpaceContextType {
  rampRefs: React.MutableRefObject<HTMLDivElement[]>;
  heroRef: React.MutableRefObject<HTMLDivElement | null>;
  standingElement: React.MutableRefObject<{
    dimension: Rect;
    platform: HTMLDivElement | undefined;
  } | null>;
}
interface Rect {
  width: number;
  height: number;
  top: number;
  left: number;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const rampRefs = useRef<HTMLDivElement[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const standingElement = useRef<{
    dimension: Rect;
    platform: HTMLDivElement | undefined;
  } | null>(null);

  return (
    <SpaceContext.Provider value={{ rampRefs, heroRef, standingElement }}>
      {children}
    </SpaceContext.Provider>
  );
};

export const useSpace = (): SpaceContextType => {
  const context = useContext(SpaceContext);
  if (!context) {
    throw new Error("useSpace must be used within a SpaceProvider");
  }
  return context;
};
