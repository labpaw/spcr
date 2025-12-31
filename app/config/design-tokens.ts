/**
 * Design Tokens
 * Central design system configuration for colors, spacing, typography, etc.
 */

export const colors = {
  // Primary colors
  primary: {
    DEFAULT: '#007aff',
    hover: '#0051d5',
    light: '#e6f2ff',
  },

  // Semantic colors
  danger: {
    DEFAULT: '#ff3b30',
    hover: '#ff1f14',
  },

  // Neutral colors
  neutral: {
    white: '#ffffff',
    black: '#000000',
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e0e0e0',
      300: '#ccc',
      400: '#999',
      500: '#666',
      600: '#333',
    },
  },

  // Background colors
  background: {
    lightGray: 'linear-gradient(to bottom, #fafafa, #f0f0f0)',
    white: '#ffffff',
    warmBeige: 'linear-gradient(to bottom, #faf8f3, #f5f1e8)',
    softBlue: 'linear-gradient(to bottom, #f0f4ff, #e6edfa)',
    mintGreen: 'linear-gradient(to bottom, #f0faf5, #e6f5ed)',
    lavender: 'linear-gradient(to bottom, #f5f0fa, #ede6f5)',
    peach: 'linear-gradient(to bottom, #fff5f0, #ffeee6)',
    darkMode: 'linear-gradient(to bottom, #1a1a1a, #0a0a0a)',
    navy: 'linear-gradient(to bottom, #1e2a3a, #0f1821)',
  },
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
} as const;

export const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  full: '50%',
} as const;

export const shadows = {
  sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
  md: '0 2px 12px rgba(0, 0, 0, 0.1)',
  lg: '0 4px 16px rgba(0, 0, 0, 0.15)',
  xl: '0 4px 24px rgba(0, 0, 0, 0.15)',
} as const;

export const typography = {
  fontFamily: {
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '24px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

export const zIndex = {
  base: 1,
  dropdown: 10,
  modal: 100,
  contextMenu: 1001,
  tooltip: 1002,
} as const;

export const animation = {
  duration: {
    fast: '0.15s',
    normal: '0.2s',
    slow: '0.3s',
  },
  easing: {
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;
