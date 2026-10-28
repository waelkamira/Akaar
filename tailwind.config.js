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
          ink: '#0A0F0C',
          canvas: '#0F1411',
          surface: '#1A231E',
          raised: '#25332A',
          elevated: '#314237',
          line: 'rgba(180, 200, 180, 0.12)',
          'line-strong': 'rgba(180, 200, 180, 0.2)',
          olive: '#8B9D77',
          sage: '#6B7B5F',
          moss: '#4A5942',
          cream: '#E8EDE5',
          muted: '#9AA896',
          quiet: '#6F7D6B',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          50: '#F2F5F0',
          100: '#E1E8DC',
          200: '#C5D4BE',
          300: '#A4BA99',
          400: '#8B9D77',
          500: '#6B7B5F',
          600: '#57634D',
          700: '#4A5942',
          800: '#3D4736',
          900: '#333C2D',
          950: '#1A1F1B',
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
        'ak-brand': 'linear-gradient(135deg, #A4BA99 0%, #8B9D77 48%, #6B7B5F 100%)',
        'ak-brand-soft': 'linear-gradient(135deg, rgba(164, 186, 153, 0.18) 0%, rgba(107, 123, 95, 0.08) 55%, transparent 100%)',
        'ak-surface': 'linear-gradient(145deg, #25332A 0%, #1A231E 56%, #0F1411 100%)',
        'ak-hero': 'linear-gradient(90deg, rgba(10, 15, 12, 0.96) 0%, rgba(15, 20, 17, 0.82) 48%, rgba(15, 20, 17, 0.16) 100%)',
        'ak-glow': 'radial-gradient(ellipse at 50% 0%, rgba(139, 157, 119, 0.16), transparent 68%)',
      },
      boxShadow: {
        'ak-card': '0 18px 48px rgba(5, 10, 7, 0.38), inset 0 1px 0 rgba(180, 200, 180, 0.04)',
        'ak-panel': '0 24px 70px rgba(5, 10, 7, 0.45), inset 0 1px 0 rgba(180, 200, 180, 0.06)',
        'ak-glow': '0 8px 30px rgba(107, 123, 95, 0.22)',
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