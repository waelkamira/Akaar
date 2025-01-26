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
        one: '#FFA500',
        two: '#F83354',
        three: '#22C55E',
        four: '#182120',
        five: '#00ff5e',
        six: '#fffdf3',
        seven: '#888888',
        eight: '#FFB38A',
        nine: '#1E2727',
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
