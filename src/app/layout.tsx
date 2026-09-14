import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Pixelify_Sans } from "next/font/google";
import { type Metadata, type Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

// The HUD face: titles, signage, prompts. Reading copy stays on Geist.
const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  // The site is reached through ilijakosanin.dev/mr-planet, so share-card
  // and icon URLs (src/app/icon.png, opengraph-image.png, …) resolve there.
  metadataBase: new URL("https://ilijakosanin.dev"),
  title: {
    default: "Mr. Planet",
    template: "%s · Mr. Planet",
  },
  description:
    "Ilija Košanin's blog as a platformer. Jump onto a post to read it.",
  openGraph: {
    title: "Mr. Planet",
    description: "A blog you have to jump to.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0a1f",
  width: "device-width",
  initialScale: 1,
  // The level is a game surface; pinch-zoom would fight the touch controls.
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${pixelify.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
