import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  {
    files: ['**/*.config.js', 'insertProducts.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: [
      'components/**/*.{js,jsx,ts,tsx}',
      'features/**/*.{js,jsx,ts,tsx}',
      'app/**/{page,layout,loading,not-found,error,template,default,global-error}.{js,jsx,ts,tsx}',
      'app/**/{sitemap,robots}.{js,ts}',
    ],
    rules: {
      'no-restricted-imports': ['error', {
        paths: [
          {
            name: '@prisma/client',
            message: 'UI and feature modules must use application APIs instead of Prisma.',
          },
        ],
        patterns: [
          {
            group: ['@/lib/db/**'],
            message: 'UI and feature modules must use application APIs instead of database clients.',
          },
        ],
      }],
    },
  },
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'node_modules/**',
    'public/**',
    'next-env.d.ts',
  ]),
]);
