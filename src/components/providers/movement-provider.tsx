import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

interface MovementContextType {
  isMoving: boolean;
  isJumping: boolean;
  maxHeight: number;
  jumpingAnimation: Set<string>;
  isDynamicPictureActive: React.MutableRefObject<boolean>;
  setIsMoving: (value: boolean) => void;
  setIsJumping: (value: boolean) => void;
  setMaxHeight: (value: number) => void;
  addJumpingAnimation: (value: string) => void;
  removeJumpingAnimation: (value: string) => void;
}

const MovementContext = createContext<MovementContextType | undefined>(
  undefined,
);

export const useMovementContext = () => {
  const context = useContext(MovementContext);
  if (!context) {
    throw new Error(
      "useMovementContext must be used within a MovementProvider",
    );
  }
  return context;
};

export const MovementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [jumpingAnimation, setJumpingAnimation] = useState<Set<string>>(
    new Set(),
  );
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const isDynamicPictureActive = useRef(false);

  const toggleIsMoving = useCallback((value: boolean) => {
    setIsMoving(value);
  }, []);

  const toggleIsJumping = useCallback((value: boolean) => {
    setIsJumping(value);
  }, []);
  const toggleMaxHeight = useCallback((value: number) => {
    setMaxHeight(value);
  }, []);
  const addJumpingAnimation = useCallback((value: string) => {
    setJumpingAnimation((prev) => {
      prev.add(value);
      return prev;
    });
  }, []);
  const removeJumpingAnimation = useCallback((value: string) => {
    setJumpingAnimation((prev) => {
      prev.delete(value);
      return prev;
    });
  }, []);

  return (
    <MovementContext.Provider
      value={{
        isMoving,
        isJumping,
        maxHeight,
        jumpingAnimation,
        isDynamicPictureActive,
        setIsMoving: toggleIsMoving,
        setIsJumping: toggleIsJumping,
        setMaxHeight: toggleMaxHeight,
        addJumpingAnimation,
        removeJumpingAnimation,
      }}
    >
      {children}
    </MovementContext.Provider>
  );
};
