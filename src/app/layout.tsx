import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { Pixelify_Sans } from "next/font/google";
import { type Metadata } from "next";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${pixelify.variable}`}>
      <body>{children}</body>
    </html>
  );
}
