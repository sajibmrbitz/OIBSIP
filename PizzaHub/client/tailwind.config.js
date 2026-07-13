import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map orange to Sky Blue
        orange: colors.sky,
        // Map red to a deep, professional Blue (a classic, high-contrast web dev combo)
        red: colors.blue,
      }
    },
  },
  plugins: [],
}
