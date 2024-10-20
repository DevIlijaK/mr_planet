import { useRef, useEffect } from "react";
import { useSpace } from "./providers/space-provider";

export const BottomRamp = () => {
  const rampRef = useRef<HTMLDivElement>(null);
  const { rampRefs } = useSpace();

  useEffect(() => {
    if (rampRef.current) {
      rampRefs.current?.push(rampRef.current);
    }
  }, [rampRef, rampRefs]);
  return <div ref={rampRef} className="h-[10dvh] w-full bg-green-500" />;
};
