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
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ]
      },
      colors: {
        light: {
          'text': '#2D2D2D',
          'background': '#F9F6F0',
          'primary': '#101f3d',
          'secondary': '#9a5000',
          'accent': '#ffc107',
        },
        dark: {
          'text': '#d1d1d1',
          'background': '#0F2027',
          'primary': '#668bc3',
          'secondary': '#ffe082',
          'accent': '#ffc107',
        },
        navy: {
          50: '#f0f4f9',
          100: '#d9e2f0',
          200: '#b3c5e1',
          300: '#8da8d2',
          400: '#668bc3',
          500: '#406eb4',
          600: '#335890',
          700: '#26436c',
          800: '#1E3A8A', // Primary
          900: '#101f3d',
        },
        amber: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#D97706', // Secondary
          700: '#c67102',
          800: '#b06000',
          900: '#9a5000',
        },
      },
    },
  },
  plugins: [],
}

