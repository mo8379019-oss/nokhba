/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Primary brand palette
        primary: {
          DEFAULT: "#8B1E23", // Red
          dark: "#5C1216", // Dark Red
          light: "#A63A3F",
        },
        gold: {
          DEFAULT: "#C9A24B",
          light: "#E0C583",
          dark: "#A9822F",
        },
        // Secondary / neutral palette
        offwhite: "#FAF8F5",
        surface: "#FFFFFF",
        dark: {
          DEFAULT: "#2B2B2B",
          light: "#4A4A4A",
        },
        gray: {
          light: "#E5E1DA",
        },
      },
      fontFamily: {
        sans: ["Cairo", "Tajawal", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.06)",
        card: "0 2px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        slideUp: { "0%": { opacity: 0, transform: "translateY(10px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        fadeIn: "fadeIn 0.4s ease-out",
        slideUp: "slideUp 0.4s ease-out",
      },
    },
  },
  plugins: [],
};
