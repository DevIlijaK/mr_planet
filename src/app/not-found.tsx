import Image from "next/image";
import Link from "next/link";
import logo from "../../public/images/hero/mr-planet-head.png";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Image
        unoptimized
        priority
        src={logo}
        alt=""
        className="pixelated h-[60px] w-[60px]"
      />
      <p className="font-pixel text-[13px] uppercase tracking-[0.12em] text-[color:var(--signal)]">
        404
      </p>
      <h1 className="font-pixel text-[28px] font-bold leading-tight text-[color:var(--crust)]">
        Nothing in this orbit.
      </h1>
      <p className="max-w-[40ch] text-[color:var(--ink-soft)]">
        The post you were beaming to isn&apos;t here. Head back to the level and
        pick another platform.
      </p>
      <Link
        href="/"
        className="hud-prompt flex items-center gap-2 px-3 py-2 font-pixel text-[13px] leading-none no-underline"
      >
        <span aria-hidden>◀</span> Back to orbit
      </Link>
    </main>
  );
}
