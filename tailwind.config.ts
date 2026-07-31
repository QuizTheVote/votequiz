import type { Config } from "tailwindcss";

/**
 * Colours come from QuizTheVote_BrandGuide.pdf, page 5. The guide gives three
 * stops per family; the remaining stops are interpolated so that the shades the
 * interface leans on hardest land exactly on a brand value:
 *
 *   ink-900  headings          #283A47  guide "deep blue-gray", primary
 *   ink-600  body copy         #50555B  guide "soft gray", primary
 *   brand-500 actions          #008C95  guide teal, primary
 *   sand-500 warm accent       #BF9160  guide accent, "used sparingly"
 */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],

  theme: {
    extend: {
      colors: {
        ink: {
          50: "#F4F6F7",
          100: "#E9EDEE",
          200: "#D5DBDE",
          300: "#C7D2D6",
          400: "#8A8E92",
          500: "#707C84",
          600: "#50555B",
          700: "#3F4750",
          800: "#35393D",
          900: "#283A47",
          950: "#1B272F"
        },
        brand: {
          50: "#EAF4F4",
          100: "#D2E8E9",
          200: "#A9D5D8",
          300: "#55B2B8",
          400: "#2A9FA6",
          500: "#008C95",
          600: "#007B83",
          700: "#005D63",
          800: "#004A4F",
          900: "#003A3E"
        },
        sand: {
          50: "#FBF5EE",
          100: "#F2E6D6",
          200: "#E5D0B6",
          300: "#D4B695",
          400: "#C9A47B",
          500: "#BF9160",
          600: "#A07850",
          700: "#7F6140",
          800: "#654E33",
          900: "#4B3A26"
        }
      },

      fontFamily: {
        // Plus Jakarta Sans is the default because the brand guide positions it
        // as the interface face: "well-suited for interface design, longer-form
        // content, and environments where performance and accessibility are key".
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif"
        ],
        display: ['"Bonnie"', '"Plus Jakarta Sans"', "ui-sans-serif", "system-ui", "sans-serif"]
      },

      // The site uses fully rounded buttons; see qtv-hero-block.txt.
      borderRadius: {
        pill: "999px"
      }
    }
  },

  plugins: []
} as Config;
