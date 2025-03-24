/**
 * AKAAR Design System
 *
 * This file defines the core design tokens and variables for the AKAAR project.
 * Use these values consistently across the application to maintain a cohesive design.
 */

// Color Palette
export const colors = {
  // Primary colors
  primary: {
    50: "#fff1e6",
    100: "#ffe8d9",
    200: "#ffd0b5",
    300: "#ffb088",
    400: "#ff9466",
    500: "#ff7c34", // Main brand color
    600: "#f25d1e",
    700: "#cc4b18",
    800: "#9c3915",
    900: "#7a2e12",
  },

  // Secondary colors
  secondary: {
    50: "#f0f4f8",
    100: "#d9e2ec",
    200: "#bcccdc",
    300: "#9fb3c8",
    400: "#829ab1",
    500: "#627d98", // Secondary brand color
    600: "#486581",
    700: "#334e68",
    800: "#243b53",
    900: "#102a43",
  },

  // Accent colors
  accent: {
    50: "#e3f8ff",
    100: "#b3ecff",
    200: "#81defd",
    300: "#5ed0fa",
    400: "#40c3f7",
    500: "#2bb0ed",
    600: "#1992d4",
    700: "#127fbf",
    800: "#0b69a3",
    900: "#035388",
  },

  // Neutral colors
  neutral: {
    50: "#f5f7fa",
    100: "#e4e7eb",
    200: "#cbd2d9",
    300: "#9aa5b1",
    400: "#7b8794",
    500: "#616e7c",
    600: "#52606d",
    700: "#3e4c59",
    800: "#323f4b",
    900: "#1f2933",
  },

  // Success, error, warning colors
  success: "#27ae60",
  error: "#e74c3c",
  warning: "#f39c12",
  info: "#3498db",

  // Background colors
  background: {
    light: "#ffffff",
    dark: "#1f2933",
    accent: "#fff8f0",
  },
}

// Typography
export const typography = {
  fontFamily: {
    primary: "Rubik, sans-serif",
    secondary: "var(--font-rubik), sans-serif",
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem", // 48px
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
}

// Spacing
export const spacing = {
  0: "0",
  1: "0.25rem", // 4px
  2: "0.5rem", // 8px
  3: "0.75rem", // 12px
  4: "1rem", // 16px
  5: "1.25rem", // 20px
  6: "1.5rem", // 24px
  8: "2rem", // 32px
  10: "2.5rem", // 40px
  12: "3rem", // 48px
  16: "4rem", // 64px
  20: "5rem", // 80px
  24: "6rem", // 96px
  32: "8rem", // 128px
}

// Borders
export const borders = {
  radius: {
    none: "0",
    sm: "0.125rem", // 2px
    default: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    "2xl": "1rem", // 16px
    "3xl": "1.5rem", // 24px
    full: "9999px",
  },
  width: {
    none: "0",
    thin: "1px",
    medium: "2px",
    thick: "4px",
  },
}

// Shadows
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
}

// Transitions
export const transitions = {
  duration: {
    fast: "150ms",
    default: "300ms",
    slow: "500ms",
    slower: "700ms",
  },
  timing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
  },
}

// Z-index
export const zIndex = {
  0: 0,
  10: 10,
  20: 20,
  30: 30,
  40: 40,
  50: 50,
  auto: "auto",
}

// Breakpoints (for responsive design)
export const breakpoints = {
  xs: "480px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
}

// Layout
export const layout = {
  container: {
    padding: {
      default: "1rem",
      sm: "2rem",
      lg: "4rem",
    },
    maxWidth: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      full: "100%",
    },
  },
}

