import forms from '@tailwindcss/forms'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        'primary-light': '#60a5fa',
        secondary: '#1e293b',
        'secondary-light': '#475569',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        background: {
          DEFAULT: '#f8fafc',
          dark: '#0f172a',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#1e293b',
        },
        'text-primary': {
          DEFAULT: '#1e293b',
          dark: '#f8fafc',
        },
        'text-secondary': {
          DEFAULT: '#475569',
          dark: '#94a3b8',
        },
        border: {
          DEFAULT: '#e2e8f0',
          dark: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'glass-fade': 'glassFade 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glassFade: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [forms],
  corePlugins: {
    preflight: true,
  },
}
