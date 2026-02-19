/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#00d2ff',
        'secondary-blue': '#3a7bd5',
        'accent-neon': '#00f2fe',
        'bg-dark': '#0f172a',
        'bg-darker': '#020617',
        'text-main': '#f8fafc',
        'text-secondary': '#94a3b8',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 210, 255, 0.4)',
      }
    },
  },
  plugins: [],
}


