import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useMovementContext } from "./movement-provider";

interface PressedKeysContextType {
  pressedKeys: Set<string>;
  handleKeyDown: (event: KeyboardEvent) => void;
  handleKeyUp: (event: KeyboardEvent) => void;
}

const PressedKeysContext = createContext<PressedKeysContextType | undefined>(
  undefined,
);

export const usePressedKeysContext = () => {
  const context = useContext(PressedKeysContext);
  if (!context) {
    throw new Error(
      "usePressedKeysContext must be used within a PressedKeysProvider",
    );
  }
  return context;
};

export const PressedKeysProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const { isDynamicPictureActive, isJumping } = useMovementContext();

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        prev.delete(event.key.toLowerCase());
        return prev;
      });
      if (pressedKeys.size === 0 && !isJumping) {
        isDynamicPictureActive.current = false;
      }
    },
    [isJumping, pressedKeys.size, isDynamicPictureActive],
  );

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    setPressedKeys((prev) => {
      if (key === "a") {
        if (prev.delete("d")) {
          isDynamicPictureActive.current = false;
        }
      } else if (key === "d") {
        if (prev.delete("a")) {
          isDynamicPictureActive.current = false;
        }
      }
      prev.add(key);
      return prev;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <PressedKeysContext.Provider
      value={{ pressedKeys, handleKeyDown, handleKeyUp }}
    >
      {children}
    </PressedKeysContext.Provider>
  );
};
