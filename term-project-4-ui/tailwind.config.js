/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'main-bg': '#080808',
        'lighter-blue': '#DFEEFF',
        'ligher-purple': '#E8E4FF',
        'ligher-green': '#C6FBF4',
        'blue-hover': '#bddeff',
        'purple-hover': '#dad4ff',
        'green-hover': '#98f7ec',
      },
      colors: {
        'main': '#080808',
        'lighter-blue': '#DFEEFF',
        'ligher-purple': '#E8E4FF',
        'ligher-green': '#C6FBF4',
      }
    },
  },
  plugins: [],
}
