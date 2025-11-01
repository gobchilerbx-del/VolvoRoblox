/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#F7F8F9',
        navy: '#003057',
        ink: '#0D1117',
        pebble: '#B6BEC6',
        ash: '#4A4F55',
        panel: '#FFFFFF',
        footer: '#E8EAEC',
        inputBorder: '#D0D5DA'
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif']
      },
      boxShadow: {
        header: '0 1px 4px rgba(0, 0, 0, 0.05)',
        card: '0 8px 24px rgba(13, 17, 23, 0.06)'
      }
    }
  },
  plugins: []
};
