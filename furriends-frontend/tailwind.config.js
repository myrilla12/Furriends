/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    extend: {
      colors: {
        brown: '#6d543e',
      },
      spacing: {
        '75': '500px',
      },
    },
  },
  plugins: [],
}

