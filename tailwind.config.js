/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b12",
        panel: "#14141f",
        accent: "#8b5cf6",
      },
    },
  },
  plugins: [],
};
