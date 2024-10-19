import React, {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

interface SpaceContextType {
  rampRefs: React.MutableRefObject<HTMLDivElement[]>;
  heroRef: React.MutableRefObject<HTMLDivElement | null>;
}

const SpaceContext = createContext<SpaceContextType | undefined>(undefined);

export const SpaceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const rampRefs = useRef<HTMLDivElement[]>([]);
  const heroRef = useRef<HTMLDivElement | null>(null);

  return (
    <SpaceContext.Provider value={{ rampRefs, heroRef }}>
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
