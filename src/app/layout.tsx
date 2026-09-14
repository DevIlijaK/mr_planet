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
  title: {
    default: "Mr. Planet",
    template: "%s · Mr. Planet",
  },
  description:
    "Ilija Košanin's blog as a platformer. Jump onto a post to read it.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Mr. Planet",
    description: "A blog you have to jump to.",
    type: "website",
  },
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
