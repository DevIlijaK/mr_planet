"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Tiptap from "~/components/tip-tap";
import useScreenSize from "~/hooks/use-screen-size";
import { cn } from "~/lib/utils";
import bg from "../../../public/images/background.jpg";

export default function BlogBuilderPage() {
  const [screenSize, setScreenSize] = useState<number | null>(null);

  const size = useScreenSize();

  useEffect(() => {
    setScreenSize(size);
  }, [size]);

  return (
    screenSize && (
      <div
        className={cn(
          "h-screen w-full py-10",
          screenSize < 640 ? "px-4" : screenSize < 1024 ? "px-20" : "px-40",
        )}
      >
        <Image
          priority
          sizes="100dvw"
          src={bg}
          alt="background-image"
          className="-z-50 h-screen w-full object-cover object-center"
          fill
        />
        <div className="flex h-full flex-col overflow-y-scroll rounded-2xl border border-solid border-gray-300 text-white first:flex">
          <Tiptap editable={true} />
        </div>
      </div>
    )
  );
}
