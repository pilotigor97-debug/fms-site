import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy:    { 900: "#0A1628", 800: "#13243C" },
        blue:    { 600: "#2D6BFF", 400: "#5C8AFF", 100: "#E6EEFF" },
        ink: {
          900: "#0B1628", 700: "#3D4A5C", 500: "#6B7689",
          400: "#8A93A3", 300: "#B5BCC8", 200: "#D0D5DD",
          100: "#E5E8EE",  50: "#F5F6F8",
        },
        success: "#00A86B",
        danger:  "#E5484D",
      },
      fontFamily: {
        sans: ["Geist", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        sm: "0 1px 2px rgba(11,22,40,0.04)",
        md: "0 4px 16px rgba(11,22,40,0.08)",
        lg: "0 12px 40px rgba(11,22,40,0.12)",
      },
      borderColor: {
        DEFAULT: "rgba(11,22,40,0.08)",
        strong:  "rgba(11,22,40,0.14)",
      },
      keyframes: {
        "fade-in":  { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "slide-up": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        pulse:      { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.5" } },
      },
      animation: {
        "fade-in":  "fade-in 200ms ease-out",
        "slide-up": "slide-up 600ms ease-out",
        pulse:      "pulse 1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
