/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      colors: {
        navy: {
          DEFAULT: "#041a37",
          light: "#0a2a4a",
          dark: "#020d1c",
        },
        pitch: {
          DEFAULT: "#0a2a4a",
          green: "#0d3d22",
          dark: "#0a3320",
        },
        accent: {
          DEFAULT: "#00c853",
          light: "#33d375",
          dark: "#00a343",
        },
        gold: {
          DEFAULT: "#ffc107",
          light: "#ffd54f",
          dark: "#ffa000",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        grass:
          "linear-gradient(180deg, rgba(4,26,55,0.92) 0%, rgba(4,26,55,0.85) 40%, rgba(4,26,55,0.95) 100%), repeating-linear-gradient(90deg, #0d3d22 0px, #0d3d22 2px, #0a3320 2px, #0a3320 8px)",
        "pitch-pattern": "radial-gradient(circle at 50% 50%, rgba(0, 200, 83, 0.1) 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
