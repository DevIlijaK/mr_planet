import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        pixel: ["var(--font-pixel)", ...fontFamily.sans],
      },
    },
  },
  plugins: [
    // Input, not width, decides whether the touch pad is shown: a phone in
    // landscape still has thumbs, a narrow desktop window still has keys.
    plugin(({ addVariant }) => {
      addVariant("coarse", "@media (pointer: coarse)");
      addVariant("fine", "@media (pointer: fine)");
    }),
  ],
} satisfies Config;
