/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./utils/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f9ff",
          100: "#e3edff",
          200: "#c4d9ff",
          300: "#9abcff",
          400: "#6c95ff",
          500: "#436dff",
          600: "#304ee6",
          700: "#233ab4",
          800: "#1c2f8c",
          900: "#1b2a6d"
        }
      }
    }
  },
  plugins: []
};

