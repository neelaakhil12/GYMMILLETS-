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
          DEFAULT: '#556B2F', // Olive Green
          light: '#6E8A3D',
          dark: '#3D4F22',
        },
        secondary: {
          DEFAULT: '#8B5E3C', // Earthy Brown
          light: '#A4734D',
          dark: '#6E492E',
        },
        accent: {
          DEFAULT: '#D4A373', // Beige/Accent
          light: '#E1BC96',
          dark: '#C78A50',
        },
        highlight: {
          DEFAULT: '#C97C5D', // Terracotta
          light: '#D9987D',
          dark: '#B9603D',
        },
        success: {
          DEFAULT: '#6A994E', // Organic Green
          light: '#80B661',
          dark: '#52773C',
        },
        cream: {
          DEFAULT: '#F8F5F0',
          dark: '#1C1A17',
        },
        textDark: '#2D2D2D',
        textLight: '#6B6B6B',
        darkBackground: '#121212',
        darkCard: '#1E1E1E',
      },
      fontFamily: {
        sans: ['Outfit', 'Poppins', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(85, 107, 47, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(85, 107, 47, 0.25)',
        'glass': '0 8px 32px 0 rgba(139, 94, 60, 0.08)',
        'glass-hover': '0 12px 40px 0 rgba(139, 94, 60, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
