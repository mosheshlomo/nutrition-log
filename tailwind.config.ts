import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9f4",
          100: "#dcf0e5",
          200: "#bbe1cd",
          300: "#8dcaac",
          400: "#5baf86",
          500: "#399469",
          600: "#2a7553",
          700: "#235f44",
          800: "#1e4c37",
          900: "#193f2e",
          950: "#0d2319",
        },
      },
    },
  },
  plugins: [],
};

export default config;
