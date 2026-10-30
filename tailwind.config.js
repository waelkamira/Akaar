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
const orange = {
  50: '#FFF4E8',
  100: '#FFE5C8',
  200: '#FFCC96',
  300: '#FFB261',
  400: '#FF9B2F',
  500: '#FF8500',
  600: '#E76F00',
  700: '#B95400',
  800: '#86400A',
  900: '#5B2E10',
  950: '#351A0A',
};

const mutedTeal = {
  50: '#F0F5F3',
  100: '#DCE7E3',
  200: '#C0D0CB',
  300: '#A3B8B2',
  400: '#879F99',
  500: '#6D8580',
  600: '#586D68',
  700: '#455956',
  800: '#344542',
  900: '#263532',
  950: '#17211F',
};

const charcoal = {
  50: '#F4F4EF',
  100: '#DEE1DE',
  200: '#BCC3BF',
  300: '#969F9B',
  400: '#707B77',
  500: '#53605C',
  600: '#414B48',
  700: '#303936',
  800: '#242A28',
  900: '#171A19',
  950: '#0E1110',
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
        neutral: charcoal,
        gray: charcoal,
        slate: mutedTeal,
        stone: charcoal,
        zinc: charcoal,
        amber: orange,
        ak: {
          ink: '#171A19',
          onyx: '#171A19',
          canvas: '#536663',
          surface: '#191D1C',
          raised: '#202625',
          elevated: '#29312F',
          line: 'rgba(235, 243, 239, 0.12)',
          'line-strong': 'rgba(235, 243, 239, 0.22)',
          amber: '#FF8500',
          'persian-orange': '#FF8500',
          copper: '#E76F00',
          honey: '#FFC66D',
          cream: '#F4F4EF',
          muted: '#BFC9C5',
          quiet: '#96A39F',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        orange,
        primary: {
          ...orange,
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
        'ak-brand': 'linear-gradient(135deg, #FF9B2F 0%, #FF8500 48%, #E76F00 100%)',
        'ak-brand-soft': 'linear-gradient(135deg, rgba(255, 133, 0, 0.22) 0%, rgba(255, 170, 84, 0.1) 55%, transparent 100%)',
        'ak-surface': 'linear-gradient(145deg, #29312F 0%, #191D1C 56%, #171A19 100%)',
        'ak-hero': 'linear-gradient(90deg, rgba(23, 26, 25, 0.96) 0%, rgba(35, 42, 40, 0.82) 48%, rgba(35, 42, 40, 0.12) 100%)',
        'ak-glow': 'radial-gradient(ellipse at 50% 0%, rgba(255, 133, 0, 0.18), transparent 68%)',
      },
      boxShadow: {
        'ak-card': '0 16px 38px rgba(14, 20, 19, 0.24), 0 2px 8px rgba(14, 20, 19, 0.12)',
        'ak-panel': '0 24px 60px rgba(11, 16, 15, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        'ak-glow': '0 8px 30px rgba(255, 133, 0, 0.22)',
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