import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0C0A09',
          card: '#1C1917',
          elevated: '#292524',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#F97316',
        },
        muted: '#78716C',
        subtle: '#A8A29E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Bebas Neue', 'sans-serif'],
        'mono-space': ['var(--font-mono-space)', 'Space Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Noto Sans KR', '-apple-system', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.07)',
      },
    },
  },
  plugins: [],
};
export default config;
