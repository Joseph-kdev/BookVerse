/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Add your custom font families
        'Poppins': ['Poppins', 'fallback-font', 'sans-serif'],
        'Tilt_Neon': ['Tilt Neon', 'fallback-font', 'serif'],
        'Buda': ['Buda', 'fallback-font', 'serif'],
        'Rubik_Dirt': ['Rubik Dirt', 'fallback-font', 'serif'],
        'Oxanium': ['Oxanium', 'fallback-font', 'serif'],
      },
      colors: {
        light: {
          'text': '#2D2D2D',
          'background': '#F9F6F0',
          'primary': '#2D4356',
          'secondary': '#6d402c',
          'accent': '#dfbf90',
        },
        dark: {
         'text': '#d1d1d1',
         'background': '#0f0c06',
         'primary': '#a8bed1',
         'secondary': '#d3a692',
         'accent': '#6f4f20',
        },
       },       
       
    },
  },
  plugins: [],
}

