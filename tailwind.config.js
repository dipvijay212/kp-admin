/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A1E6A",
        secondary: "#F5F7FA",
        success: "#00C853",
      }
    },
  },
  plugins: [],
}
