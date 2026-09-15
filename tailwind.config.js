/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aegean: { DEFAULT: '#1e4f9a', dark: '#173b70', soft: '#eaf1fb' },
        sand: '#f6f1e7',
        paper: '#fffdf9',
        ink: '#1f2e3b',
        muted: '#687783',
        sun: '#d99343',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(35,48,66,.10)',
      },
    },
  },
  plugins: [],
}
