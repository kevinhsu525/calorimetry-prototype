/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cal-dark': '#141415',
        'cal-card': '#202324',
        'cal-border': '#373b3d',
        'cal-text': '#f9f9fa',
        'cal-text-secondary': '#babdc0',
        'cal-accent': '#b39cf1',
        'cal-accent-bright': '#be77f3',
        'cal-grid': '#525457',
        'cal-button-bg': '#61587f',
      },
    },
  },
  plugins: [],
}
