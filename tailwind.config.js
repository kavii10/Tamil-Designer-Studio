/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5EFEB',
          300: '#EAE1D7',
          400: '#DDD0C2',
        },
        beige: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E8DED2',
          300: '#D8C7B5',
          400: '#C2AC95',
          500: '#AB9177',
        },
        studio: {
          50: '#F7F5F4',
          100: '#EDE7E4',
          200: '#DACDC7',
          300: '#BFABA2',
          400: '#9E8175',
          500: '#7B5E51',
          600: '#5A4237',
          700: '#423027',
          800: '#2D1E18', // Primary Dark Brown
          900: '#1C120E', // Deep Espresso
        },
        gold: {
          50: '#FCF9EE',
          100: '#F8F1D4',
          200: '#F0E2A8',
          300: '#E4CE74',
          400: '#D4B843',
          500: '#C59B27', // Soft Gold
          600: '#A67F19',
          700: '#7E5F12',
          800: '#5C4410',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Mukta Malar"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Tamil"', '"Mukta Malar"', 'Inter', 'system-ui', 'sans-serif'],
        tamil: ['"Mukta Malar"', '"Noto Sans Tamil"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 10px -2px rgba(45, 30, 24, 0.05)',
        'premium': '0 10px 30px -5px rgba(45, 30, 24, 0.08), 0 4px 6px -2px rgba(45, 30, 24, 0.03)',
        'gold': '0 8px 25px -4px rgba(197, 155, 39, 0.25)',
      },
    },
  },
  plugins: [],
}
