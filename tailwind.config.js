/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'red-gradient': 'linear-gradient(to bottom, #BC2B41, #56141e)',
        'red-gradient-invert': 'linear-gradient(to bottom, #56141e, #BC2B41)',
        'dark-gradient': 'linear-gradient(147deg, #56141e 0%, #272120 90%)',
      },
    },
  },
  plugins: [],
}

// 'red-gradient': 'linear-gradient(to bottom, #b81211, #5d222a )',
// 'red-gradient-invert': 'linear-gradient(to bottom, #5d222a, #b81211)',
// background-color: #56141e;
// background-image: linear-gradient(147deg, #56141e 0%, #272120 60%);
