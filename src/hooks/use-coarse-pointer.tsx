"use client";

import { useEffect, useState } from "react";

/**
 * True when the device's primary pointer is a finger — the case where the
 * keyboard the game is bound to doesn't exist and the on-screen controls have
 * to stand in for it.
 *
 * Starts false so the server render and the first client render agree; the
 * effect flips it on before paint on the devices that need it. Deliberately a
 * pointer query rather than a width breakpoint: a narrow desktop window still
 * has a keyboard, and a tablet in landscape still doesn't.
 */
export default function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(query.matches);

    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return coarse;
}
