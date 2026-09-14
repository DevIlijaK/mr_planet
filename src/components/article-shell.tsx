"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import bg from "../../public/images/background.jpg";
import heroSprite from "../../public/images/hero/mr-planet.png";
import logo from "../../public/images/hero/mr-planet-head.png";
import { RETURN_KEY, TELEPORT_MS } from "~/lib/teleport";

interface ArticleShellProps {
  locale: "en" | "sr";
  /** The English slug, i.e. the platform the hero beams back onto. */
  returnTo: string;
  children: ReactNode;
}

/**
 * The reading page. Quiet on purpose — the only game left in it is Mr. Planet
 * waiting in the corner, and one key to send him (and you) back to the level.
 */
export const ArticleShell: FC<ArticleShellProps> = ({
  locale,
  returnTo,
  children,
}) => {
  const router = useRouter();
  const [leaving, setLeaving] = useState(false);
  const [arrived, setArrived] = useState(false);
  const sr = locale === "sr";

  useEffect(() => {
    const timer = setTimeout(() => setArrived(true), TELEPORT_MS);
    router.prefetch("/");
    return () => clearTimeout(timer);
  }, [router]);

  const goBack = useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    try {
      sessionStorage.setItem(RETURN_KEY, returnTo);
    } catch {
      // Storage blocked; the hero respawns on the floor instead.
    }
    setTimeout(() => router.push("/"), TELEPORT_MS);
  }, [leaving, returnTo, router]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      )
        return;
      const key = event.key.toLowerCase();
      if (key === "escape" || key === "m") {
        event.preventDefault();
        goBack();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goBack]);

  const backLabel = sr ? "Nazad u orbitu" : "Back to orbit";

  return (
    <div className="relative min-h-[100dvh]">
      <Image
        priority
        sizes="100vw"
        src={bg}
        alt=""
        aria-hidden
        className="fixed inset-0 -z-10 h-full w-full object-cover object-center opacity-70"
      />
      {/* Darken the starfield under the copy without hiding it at the edges. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgb(11_10_31_/_0.92)_0%,rgb(11_10_31_/_0.82)_55%,rgb(11_10_31_/_0.55)_100%)]"
      />

      <nav className="bg-[color:var(--void)]/85 sticky top-0 z-20 border-b-2 border-[color:var(--outline)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[68ch] items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <Link
            href="/"
            onClick={(event) => {
              event.preventDefault();
              goBack();
            }}
            className="hud-prompt flex items-center gap-2 px-2 py-1 font-pixel text-[12px] leading-none no-underline"
          >
            <span aria-hidden>◀</span>
            <span>{backLabel}</span>
            <kbd className="hud-prompt-key fine-only ml-1 px-[5px] py-[3px]">
              esc
            </kbd>
          </Link>
          <span className="signage flex items-center gap-2 font-pixel text-[14px] font-bold tracking-wide text-[color:var(--crust)]">
            MR. PLANET
            <Image
              unoptimized
              src={logo}
              alt=""
              className="pixelated h-[30px] w-[30px]"
            />
          </span>
        </div>
      </nav>

      <div className="mx-auto max-w-[68ch] px-5 pb-40 pt-10 sm:px-6 sm:pt-16">
        {children}
      </div>

      {/* Mr. Planet, waiting. He beams in on arrival and out when you leave;
          tapping him is the same as pressing Esc. */}
      <button
        type="button"
        onClick={goBack}
        aria-label={backLabel}
        className={`group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-20 flex flex-col items-center gap-2 sm:bottom-6 sm:right-8 ${
          leaving ? "" : arrived ? "avatar-idle" : ""
        }`}
      >
        <span className="hud-prompt whitespace-nowrap px-2 py-1 font-pixel text-[12px] leading-none opacity-90 transition-opacity group-hover:opacity-100">
          {leaving
            ? sr
              ? "Teleportujem…"
              : "Beaming up…"
            : sr
              ? "Idemo nazad?"
              : "Head back?"}
        </span>
        <span
          className={`relative block ${
            leaving ? "hero-beam-out" : arrived ? "" : "hero-beam-in"
          }`}
        >
          <span className="beam" aria-hidden />
          <Image
            unoptimized
            src={heroSprite}
            width={38}
            height={58}
            alt=""
            className="pixelated relative"
            style={{ width: 38, height: 58 }}
          />
        </span>
      </button>
    </div>
  );
};
