/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        hanzi: ['"Noto Sans SC"', '"Microsoft YaHei"', '"PingFang SC"', 'sans-serif'],
      },
      colors: {
        slate: {
          850: '#172033',
          950: '#0a0f1a',
        },
        hsk: {
          1: { DEFAULT: '#22c55e', light: '#bbf7d0', dark: '#166534' },
          2: { DEFAULT: '#3b82f6', light: '#bfdbfe', dark: '#1e40af' },
          3: { DEFAULT: '#f59e0b', light: '#fde68a', dark: '#92400e' },
          4: { DEFAULT: '#ef4444', light: '#fecaca', dark: '#991b1b' },
          5: { DEFAULT: '#8b5cf6', light: '#ddd6fe', dark: '#5b21b6' },
          6: { DEFAULT: '#d97706', light: '#fde68a', dark: '#78350f' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
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
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
