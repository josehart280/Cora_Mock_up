/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta terapéutica Cora
        teal: {
          50:  '#edfafa',
          100: '#d5f5f6',
          200: '#afeaec',
          300: '#7dd8da',
          400: '#45bfc2',
          500: '#2aa8ab', // primary
          600: '#1f8487',
          700: '#1c6a6d',
          800: '#1c5557',
          900: '#1b4648',
          950: '#0a2e30',
        },
        sage: {
          50:  '#f5f7f2',
          100: '#e8ede1',
          200: '#d1dbc5',
          300: '#b0c29f',
          400: '#8da578',
          500: '#6d8958', // accent
          600: '#566e44',
          700: '#445737',
          800: '#39472f',
          900: '#303c28',
        },
        warm: {
          50:  '#fdf8f3',
          100: '#f9eed9',
          200: '#f2dab2',
          300: '#e9c07e',
          400: '#e0a44d',
          500: '#d68e2d',
          600: '#be7422',
          700: '#9d5a1e',
          800: '#7e4820',
          900: '#673c1d',
        },
        coral: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
        },
        // Neutrales
        surface: {
          50:  '#fafaf9',
          100: '#f5f4f2',
          200: '#e8e6e1',
          300: '#d4d0c8',
          400: '#a8a29a',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 8px 60px rgba(0, 0, 0, 0.15)',
        'cora': '0 4px 24px rgba(42, 168, 171, 0.2)',
        'cora-lg': '0 8px 48px rgba(42, 168, 171, 0.3)',
      },
      backgroundImage: {
        'gradient-cora': 'linear-gradient(135deg, #2aa8ab 0%, #1c6a6d 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f9eed9 0%, #fdf8f3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a2e30 0%, #1c1917 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232aa8ab' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
