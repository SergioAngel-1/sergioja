import type { Config } from 'tailwindcss';
import preset from '../shared/tailwind-preset';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  presets: [preset],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: '#FFFFFF',
          secondary: '#000000',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          dark: '#000000',
          'dark-elevated': '#0A0A0A',
          'dark-surface': '#1A1A1A',
          'gray-light': '#E5E5E5',
          'gray-medium': '#737373',
          'gray-dark': '#262626',
        },
      },
    },
  },
  plugins: [],
};

export default config;
