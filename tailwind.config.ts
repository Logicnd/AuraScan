import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
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
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
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
        // AuraScan Custom Colors
        aura: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        karma: {
          positive: '#10b981',
          neutral: '#f59e0b',
          negative: '#ef4444',
        },
        ethics: {
          safe: '#22c55e',
          warning: '#eab308',
          danger: '#ef4444',
          critical: '#dc2626',
        },
        xp: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#e5e4e2',
          diamond: '#b9f2ff',
        },
        neon: {
          cyan: '#00ffff',
          magenta: '#ff00ff',
          green: '#39ff14',
          blue: '#0066ff',
          purple: '#bf00ff',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
        display: ['var(--font-orbitron)', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px var(--glow-color), 0 0 10px var(--glow-color)',
          },
          '50%': {
            boxShadow: '0 0 20px var(--glow-color), 0 0 30px var(--glow-color)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'ethics-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        'level-up': {
          '0%': { transform: 'scale(1)', filter: 'brightness(1)' },
          '50%': { transform: 'scale(1.2)', filter: 'brightness(1.5)' },
          '100%': { transform: 'scale(1)', filter: 'brightness(1)' },
        },
        'badge-unlock': {
          '0%': { transform: 'rotateY(0deg)', opacity: '0' },
          '50%': { transform: 'rotateY(180deg)', opacity: '0.5' },
          '100%': { transform: 'rotateY(360deg)', opacity: '1' },
        },
        'karma-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'neon-flicker': {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': {
            textShadow: '0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px var(--neon-color), 0 0 80px var(--neon-color)',
          },
          '20%, 24%, 55%': {
            textShadow: 'none',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'ethics-pulse': 'ethics-pulse 2s ease-in-out infinite',
        'level-up': 'level-up 0.6s ease-in-out',
        'badge-unlock': 'badge-unlock 0.8s ease-in-out',
        'karma-flow': 'karma-flow 3s ease infinite',
        'neon-flicker': 'neon-flicker 1.5s infinite alternate',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'ethics-gradient': 'linear-gradient(135deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%)',
        'karma-gradient': 'linear-gradient(90deg, #ef4444 0%, #f59e0b 50%, #22c55e 100%)',
        'xp-gradient': 'linear-gradient(135deg, #ffd700 0%, #ff6b6b 50%, #4ecdc4 100%)',
        'cyber-grid': 'linear-gradient(rgba(0,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'cyber-grid': '20px 20px',
      },
      boxShadow: {
        'neon-cyan': '0 0 5px #00ffff, 0 0 20px #00ffff, 0 0 40px #00ffff',
        'neon-green': '0 0 5px #39ff14, 0 0 20px #39ff14, 0 0 40px #39ff14',
        'neon-purple': '0 0 5px #bf00ff, 0 0 20px #bf00ff, 0 0 40px #bf00ff',
        'ethics-safe': '0 0 10px #22c55e, 0 0 20px #22c55e',
        'ethics-warning': '0 0 10px #eab308, 0 0 20px #eab308',
        'ethics-danger': '0 0 10px #ef4444, 0 0 20px #ef4444',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
