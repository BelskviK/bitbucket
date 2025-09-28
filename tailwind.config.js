/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        customOrange: "#FF4000",
        customGray: "#E1DFE1",
        customBlack: "#10151F",
        customText: "#3E424A",
      },
      screens: {
        "3xl": "1920px",
      },
    },
  },
  plugins: [],
};
