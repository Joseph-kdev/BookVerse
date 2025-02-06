/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'text': '#2D2D2D',
        'background': '#F9F6F0',
        'primary': '#2D4356',
        'secondary': '#6d402c',
        'accent': '#dfbf90',
       },       
    },
  },
  plugins: [],
}

