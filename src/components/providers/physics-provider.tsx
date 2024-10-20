"use client";

import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
import useScreenSize from "~/hooks/use-screen-size";

interface PhysicsContextType {
  step: number;
  screenHeight: number;
  screenWidth: number;
  gravity: number;
  jumpVelocity: number;
  gravitationVelocity: number;
  setGravitationVelocity: Dispatch<SetStateAction<number>>;
  initialY: React.MutableRefObject<number>;
  initialX: React.MutableRefObject<number>;
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
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const [step, setStep] = useState(6);
  const [gravitationVelocity, setGravitationVelocity] = useState<number>(0);
  const [gravity, setGravity] = useState<number>(0.002);
  const [jumpVelocity, setJumpVelocity] = useState<number>(5);
  const size = useScreenSize();
  const initialY = useRef<number>(0);
  const initialX = useRef<number>(0);

  useEffect(() => {
    if (size < 640) {
      setStep(5);
      setGravity(0.005);
      setJumpVelocity(5.5);
    } else if (size < 1024) {
      setStep(5);
      setGravity(0.003);
      setJumpVelocity(5.5);
    }
  }, [size]);

  return (
    <PhysicsContext.Provider
      value={{
        step,
        screenHeight,
        screenWidth,
        jumpVelocity,
        gravity,
        gravitationVelocity,
        setGravitationVelocity,
        initialX,
        initialY,
      }}
    >
      {children}
    </PhysicsContext.Provider>
  );
};
