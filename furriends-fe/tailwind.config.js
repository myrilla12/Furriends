/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}",],
  theme: {
    colours: {
      'slate': colors.slate,
    },
    extend: {},
  },
  plugins: [],
}

