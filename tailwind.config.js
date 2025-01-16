/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        one: '#22C55E',
        two: '#F83354',
        three: '#FFA500',
        four: '#182120',
        five: '#00ff5e',
        six: '#F7F5F2',

        seven: '#F8EEDB',
        eight: '#979797',
        nine: '#FFC83D',
        ten: '#FDF2D6',
        eleven: '#FADDB1',
        twelve: '#22C55E',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        xs: '1px',
      },
    },
  },
  plugins: [],
};
