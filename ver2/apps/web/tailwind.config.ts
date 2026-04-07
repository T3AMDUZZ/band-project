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
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        border: 'rgba(255,255,255,0.07)',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        'mono-space': ['Space Mono', 'monospace'],
        sans: ['Noto Sans KR', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(245, 158, 11, 0.8)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-up': 'fade-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};

export default config;
