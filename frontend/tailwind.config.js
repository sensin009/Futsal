/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#041a37",
        pitch: "#0a2a4a",
        accent: "#00c853",
        gold: "#ffc107",
      },
      backgroundImage: {
        grass:
          "linear-gradient(180deg, rgba(4,26,55,0.92) 0%, rgba(4,26,55,0.85) 40%, rgba(4,26,55,0.95) 100%), repeating-linear-gradient(90deg, #0d3d22 0px, #0d3d22 2px, #0a3320 2px, #0a3320 8px)",
      },
    },
  },
  plugins: [],
};
