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
    extend: {},
  },
  plugins: [],
};

export default config;
