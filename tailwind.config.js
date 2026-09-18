/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        aegean: { DEFAULT: '#2b5fa9', dark: '#1f4073', soft: '#eaf1fb' },
        sand: '#efe8d8',
        paper: '#f5f2e9',
        ink: '#171817',
        muted: '#676964',
        sun: '#dfa552',
      },
      boxShadow: {
        soft: '0 20px 60px rgba(35,48,66,.10)',
      },
    },
  },
  plugins: [],
}
