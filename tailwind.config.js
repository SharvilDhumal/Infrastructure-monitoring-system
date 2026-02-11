/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        brand: {
          900: '#0a0f1e', // near-black deep navy
          800: '#0b1225',
          700: '#0e1833',
        },
        accent: {
          blue: '#0ea5e9', // electric blue
          cyan: '#22d3ee',
          purple: '#8b5cf6',
        }
      },
      dropShadow: {
        'glow-blue': '0 0 0.35rem rgba(56, 189, 248, 0.6)',
        'glow-purple': '0 0 0.35rem rgba(139, 92, 246, 0.6)',
        'glow-cyan': '0 0 0.35rem rgba(34, 211, 238, 0.6)',
      },
      boxShadow: {
        'glow-blue': '0 0 2rem rgba(56, 189, 248, 0.25)',
        'glow-purple': '0 0 2rem rgba(139, 92, 246, 0.25)',
        'glow-cyan': '0 0 2rem rgba(34, 211, 238, 0.25)',
        'glass': '0 10px 30px rgba(0,0,0,0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      }
    },
  },
  plugins: [],
}
