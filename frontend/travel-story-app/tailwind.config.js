/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: ["Montserrat", "serif"]
    },
    extend: {
      //colors used in project
      colors: {
        primary: "#05B6D3",
        secondary: "#EF863E",
      },
      backgroundImage:{
        'login-bg-img': "url('/src/assets/images/login-img.jpg')",
        'signup-bg-img': "url('/src/assets/images/signup-img.jpg')",
      }
    },
  },
  plugins: [],
}

