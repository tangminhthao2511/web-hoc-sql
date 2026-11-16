/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        brand: {
          50: '#FFF8EB',
          100: '#FFECC7',
          200: '#FFD78A',
          300: '#FFBC4D',
          400: '#FFA11F',
          500: '#F98207',
          600: '#DD5E02',
          700: '#B73F06',
        },
        edu: {
          50: '#EEF4FF',
          100: '#D9E6FF',
          500: '#3B6BFF',
          600: '#2550EB',
          700: '#1D3FD8',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.04)',
        tactile: '0 4px 0 0 rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [],
};
