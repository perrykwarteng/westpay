import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        PrimColor: "#2B0850",
      },
    },
  },
  plugins: [],
};

export default config;
