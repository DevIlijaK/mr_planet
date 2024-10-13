"use client";

import { useState, useEffect } from "react";

export default function useScreenSize() {
  const [screenSize, setScreenSize] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    function handleResize() {
      setScreenSize(window.innerWidth);
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
}
