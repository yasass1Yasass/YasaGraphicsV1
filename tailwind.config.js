/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#16A34A",
          dark: "#15803D",
          light: "#86EFAC",
          bg: "#F6FBF7",
          ink: "#0B0F0E",
        },
      },
      borderRadius: { '2xl': '1rem' },
    },
  },
  plugins: [],
}
