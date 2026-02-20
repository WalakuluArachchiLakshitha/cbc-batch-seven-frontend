/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#fa812f",
        primary: "#fef3e2",
        secondary: "#393e46",
      },
    },
  },
  plugins: [],
}
