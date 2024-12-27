/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        title: ["Bungee" ,"sans-serif"],
        subheading  : ["Poetsen One" ,"sans-serif"],
      },
      backgroundColor: {
        primary: "rgb(237, 95, 19)",  
        primaryDark:"rgb(214, 76, 2)",
      },
    },
  },
  plugins: [],
}