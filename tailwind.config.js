/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#FAF7F2',
        crema: '#F4EFE6',
        sandstone: '#E8E1D5',
        olive: {
          DEFAULT: '#2D3E2F',
          50: '#F4F7F4',
          100: '#E6ECE5',
          600: '#3D5240',
          700: '#314434',
          800: '#263528',
          900: '#1B261D',
        },
        terracotta: {
          DEFAULT: '#C86D51',
          light: '#DF8D74',
          dark: '#9E4E36'
        },
        gold: {
          DEFAULT: '#C5A880',
          light: '#E0CCAE',
          dark: '#9C7F57'
        },
        charcoal: '#1E1F1D',
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'luxury': '0 20px 45px -10px rgba(45, 62, 47, 0.12), 0 8px 18px -6px rgba(197, 168, 128, 0.1)',
        'floating': '0 12px 35px rgba(33, 48, 35, 0.35)',
      }
    },
  },
  plugins: [],
}