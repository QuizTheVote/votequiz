import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
        // These read CSS variables so a newsroom embed can override them from
        // the URL. :root in app.css holds the brand defaults; the quiz page
        // overwrites the variables only when appearance params are present.
        ink: {
          50: "var(--qtv-ink-50)",
          100: "var(--qtv-ink-100)",
          200: "var(--qtv-ink-200)",
          300: "var(--qtv-ink-300)",
          400: "var(--qtv-ink-400)",
          500: "var(--qtv-ink-500)",
          600: "var(--qtv-ink-600)",
          700: "var(--qtv-ink-700)",
          800: "var(--qtv-ink-800)",
          900: "var(--qtv-ink-900)",
          950: "#1B272F"
        },
        brand: {
          50: "var(--qtv-brand-50)",
          100: "var(--qtv-brand-100)",
          200: "var(--qtv-brand-200)",
          300: "var(--qtv-brand-300)",
          400: "var(--qtv-brand-400)",
          500: "var(--qtv-brand-500)",
          600: "var(--qtv-brand-600)",
          700: "var(--qtv-brand-700)",
          800: "var(--qtv-brand-800)",
          900: "var(--qtv-brand-900)"
        },
        sand: {
          50: "#FBF5EE",
          100: "#F2E6D6",
          200: "#E5D0B6",
          300: "var(--qtv-sand-300)",
          400: "#C9A47B",
          500: "var(--qtv-sand-500)",
          600: "#A07850",
          700: "#7F6140",
          800: "#654E33",
          900: "#4B3A26"
        }
      },

      fontFamily: {
        sans: ["var(--qtv-font-sans)"],
        display: ["var(--qtv-font-display)"]
      },

      // The site uses fully rounded buttons; see qtv-hero-block.txt.
      borderRadius: {
        pill: "999px"
      },

      // The About and Methodology pages have always carried `prose` classes,
      // but the plugin providing them was never installed, so every heading on
      // those pages rendered at body size. This themes them once installed.
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#50555B",
            "--tw-prose-headings": "#283A47",
            "--tw-prose-bold": "#283A47",
            "--tw-prose-links": "#005D63",
            "--tw-prose-bullets": "#C7D2D6",
            "--tw-prose-quotes": "#283A47",
            "--tw-prose-quote-borders": "#008C95",
            "--tw-prose-hr": "#D5DBDE",
            "h1, h2, h3, h4": {
              fontFamily: '"Bonnie", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif'
            }
          }
        }
      }
    }
  },

  plugins: [typography]
} as Config;
