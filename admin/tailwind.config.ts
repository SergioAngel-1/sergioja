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
          primary: '#FF0000',
          secondary: '#00BFFF',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          dark: '#0A0A0F',
          'dark-elevated': '#1A1A1F',
          'dark-surface': '#2A2A2F',
        },
      },
    },
  },
  plugins: [],
};

export default config;
