// // /** @type {import('tailwindcss').Config} */
// // module.exports = {
// //   content: [
// //     './pages/**/*.{js,ts,jsx,tsx,mdx}',
// //     './components/**/*.{js,ts,jsx,tsx,mdx}',
// //     './app/**/*.{js,ts,jsx,tsx,mdx}',
// //   ],
// //   theme: {
// //     extend: {
// //       colors: {
// //         one: '#FF7C34',
// //         two: '#4C4D4F',
// //         three: '#7E7F81',
// //         four: '#A1A5AD',
// //         five: '#F2F4F7',
// //       },
// //       backgroundImage: {
// //         'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
// //         'gradient-conic':
// //           'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
// //       },
// //       screens: {
// //         xs: '1px',
// //       },
// //     },
// //   },
// //   plugins: [],
// // };
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: ['class'],
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './components/**/*.{js,ts,jsx,tsx,mdx}',
//     './app/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/**/*.{js,ts,jsx,tsx,mdx}',
//     '*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     container: {
//       center: true,
//       padding: '2rem',
//       screens: {
//         '2xl': '1400px',
//       },
//     },
//     extend: {
//       colors: {
//         ak: {
//           ink: '#120B07',
//           canvas: '#17100B',
//           surface: '#21160F',
//           raised: '#2D1D13',
//           elevated: '#392519',
//           line: 'rgba(255, 224, 187, 0.12)',
//           'line-strong': 'rgba(255, 224, 187, 0.2)',
//           amber: '#E79A4B',
//           copper: '#C77A3E',
//           honey: '#FFC477',
//           cream: '#F8EBDD',
//           muted: '#B9A393',
//           quiet: '#8E7969',
//         },
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',
//         background: 'hsl(var(--background))',
//         foreground: 'hsl(var(--foreground))',
//         primary: {
//           50: '#FFF7EB',
//           100: '#FFE8CB',
//           200: '#FFD39F',
//           300: '#FFC477',
//           400: '#F2AC5E',
//           500: '#E79A4B',
//           600: '#C77A3E',
//           700: '#A55E31',
//           800: '#754125',
//           900: '#4A2B1C',
//           950: '#2A180F',
//           DEFAULT: 'hsl(var(--primary))',
//           foreground: 'hsl(var(--primary-foreground))',
//         },

//         secondary: {
//           DEFAULT: 'hsl(var(--secondary))',
//           foreground: 'hsl(var(--secondary-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//       },
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },
//       backgroundImage: {
//         'ak-brand': 'linear-gradient(135deg, #FFC477 0%, #E79A4B 48%, #B86635 100%)',
//         'ak-brand-soft': 'linear-gradient(135deg, rgba(255, 196, 119, 0.18) 0%, rgba(199, 122, 62, 0.08) 55%, transparent 100%)',
//         'ak-surface': 'linear-gradient(145deg, #2D1D13 0%, #21160F 56%, #19110C 100%)',
//         'ak-hero': 'linear-gradient(90deg, rgba(18, 11, 7, 0.96) 0%, rgba(24, 14, 8, 0.82) 48%, rgba(24, 14, 8, 0.16) 100%)',
//         'ak-glow': 'radial-gradient(ellipse at 50% 0%, rgba(231, 154, 75, 0.16), transparent 68%)',
//       },
//       boxShadow: {
//         'ak-card': '0 18px 48px rgba(8, 4, 2, 0.38), inset 0 1px 0 rgba(255, 230, 199, 0.04)',
//         'ak-panel': '0 24px 70px rgba(8, 4, 2, 0.45), inset 0 1px 0 rgba(255, 230, 199, 0.06)',
//         'ak-glow': '0 8px 30px rgba(199, 122, 62, 0.22)',
//       },
//       keyframes: {
//         'accordion-down': {
//           from: { height: 0 },
//           to: { height: 'var(--radix-accordion-content-height)' },
//         },
//         'accordion-up': {
//           from: { height: 'var(--radix-accordion-content-height)' },
//           to: { height: 0 },
//         },
//       },
//       animation: {
//         'accordion-down': 'accordion-down 0.2s ease-out',
//         'accordion-up': 'accordion-up 0.2s ease-out',
//       },
//     },
//   },
//   plugins: [require('tailwindcss-animate')],
// };
/** @type {import('tailwindcss').Config} */
const persianOrange = {
  50: '#FFF4EF',
  100: '#FCE5DC',
  200: '#F6C8B5',
  300: '#EFB091',
  400: '#E8A07C',
  500: '#E0926B',
  600: '#C87753',
  700: '#A95F3E',
  800: '#82472F',
  900: '#5D3224',
  950: '#392018',
};

module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        ak: {
          ink: '#252525',
          canvas: '#454545',
          surface: '#4D4D4D',
          raised: '#565656',
          elevated: '#606060',
          line: 'rgba(255, 255, 255, 0.12)',
          'line-strong': 'rgba(255, 255, 255, 0.2)',
          amber: '#E0926B',
          copper: '#C87753',
          honey: '#F0AE8E',
          cream: '#F7F1EE',
          muted: '#D0C5BF',
          quiet: '#B1A49E',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        orange: persianOrange,
        primary: {
          ...persianOrange,
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      backgroundImage: {
        'ak-brand': 'linear-gradient(135deg, #F0AE8E 0%, #E0926B 48%, #C87753 100%)',
        'ak-brand-soft': 'linear-gradient(135deg, rgba(224, 146, 107, 0.2) 0%, rgba(200, 119, 83, 0.08) 55%, transparent 100%)',
        'ak-surface': 'linear-gradient(145deg, #565656 0%, #4D4D4D 56%, #454545 100%)',
        'ak-hero': 'linear-gradient(90deg, rgba(37, 37, 37, 0.96) 0%, rgba(69, 69, 69, 0.82) 48%, rgba(69, 69, 69, 0.16) 100%)',
        'ak-glow': 'radial-gradient(ellipse at 50% 0%, rgba(224, 146, 107, 0.18), transparent 68%)',
      },
      boxShadow: {
        'ak-card': '0 18px 48px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
        'ak-panel': '0 24px 70px rgba(0, 0, 0, 0.36), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'ak-glow': '0 8px 30px rgba(224, 146, 107, 0.2)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};