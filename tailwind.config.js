/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lego: {
          red: '#D13131',    // Helder rood
          blue: '#206CC3',   // Helder blauw
          yellow: '#F4CE34', // Lego geel
          green: '#2A9A4A',  // Lego groen
          dark: '#1F1F1F',   // Donkergrijs voor tekst
        }
      },
      fontFamily: {
        sans: ['Verdana', 'sans-serif'], // Een duidelijk leesbaar lettertype voor kinderen
      }
    },
  },
  plugins: [],
}