/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        'red-gradient': 'linear-gradient(to bottom, #BC2B41, #56141E)',
        'red-gradient-invert': 'linear-gradient(to bottom, #56141E, #BC2B41)',
      },
    },
  },
  plugins: [],
}

