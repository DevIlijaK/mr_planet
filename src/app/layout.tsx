import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Pixelify_Sans } from "next/font/google";
import { type Metadata, type Viewport } from "next";

// The HUD face: titles, signage, prompts. Reading copy stays on Geist.
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "Mr. Planet",
  description: "A blog you have to jump to.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // The scene is sized in dvh and drawn to the edges, so it has to be allowed
  // under the notch and the home indicator; the controls pad themselves back
  // out with env(safe-area-inset-*).
  viewportFit: "cover",
  // Deliberately not `userScalable: false`. Pinch-zoom is switched off per
  // element, on the controls, so that the posts themselves stay zoomable —
  // this layout wraps the reading pages too.
  themeColor: "#0b0a1f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${pixelify.variable}`}>
      <body>{children}</body>
    </html>
  );
}
