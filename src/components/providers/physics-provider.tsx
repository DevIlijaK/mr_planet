"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";

interface PhysicsContextType {
  step: number;
  screenHeight: number;
  screenWidth: number;
  gravitationVelocity: number;
  setGravitationVelocity: (value: number) => void;
}

export const PhysicsContext = createContext<PhysicsContextType | undefined>(
  undefined,
);

export const usePhysicsContext = () => {
  const context = useContext(PhysicsContext);

  if (!context) {
    throw new Error("usePhysicsContext must be used within a PhysicsProvider");
  }

  return context;
};

export const PhysicsContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [step, setStep] = useState(0);
  const [gravitationVelocity, setGravitationVelocity] = useState<number>(0);

  const calculateStep = useCallback(() => {
    const calculatedStep = ((screenWidth + screenHeight) / 2) * 0.003;
    setStep(calculatedStep);
  }, []);

  useEffect(() => {
    calculateStep();

    const handleResize = () => {
      calculateStep();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleGravitationVelocity = useCallback((value: number) => {
    setGravitationVelocity(value);
  }, []);

  return (
    <PhysicsContext.Provider
      value={{
        step,
        screenHeight,
        screenWidth,
        gravitationVelocity,
        setGravitationVelocity: toggleGravitationVelocity,
      }}
    >
      {children}
    </PhysicsContext.Provider>
  );
};
