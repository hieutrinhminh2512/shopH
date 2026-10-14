/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          orange: '#ee4d2d',
          darkOrange: '#d73211',
          lightOrange: '#ff5722',
          peach: '#fef6f5',
          gold: '#ffb916',
          bg: '#f5f5f5',
          textDark: '#222222',
          textMuted: '#757575',
          border: '#e8e8e8',
          mall: '#d0011b',
        }
      },
      boxShadow: {
        'shopee': '0 1px 1px 0 rgba(0,0,0,.05)',
        'shopee-hover': '0 2px 8px rgba(0,0,0,.15)',
        'shopee-card': '0 1px 2px 0 rgba(0,0,0,.1)',
      }
    },
  },
  plugins: [],
}
