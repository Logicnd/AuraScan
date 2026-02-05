import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        void: '#05060a',
        abyss: '#0b0f17',
        ink: '#0f172a',
        mist: '#94a3b8',
        signal: '#59f0d3',
        neon: '#3cf2b4',
        ember: '#ff6b6b',
        halo: '#7dd3fc'
      },
      boxShadow: {
        glow: '0 0 25px rgba(89, 240, 211, 0.25)',
        ember: '0 0 30px rgba(255, 107, 107, 0.25)'
      },
      backgroundImage: {
        noise:
          "linear-gradient(rgba(255,255,255,0.02), rgba(255,255,255,0.02)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
        scanlines:
          'repeating-linear-gradient(to bottom, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 3px)'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-120%)', opacity: '0' },
          '20%': { opacity: '0.6' },
          '100%': { transform: 'translateY(120%)', opacity: '0' }
        },
        flicker: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' }
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(4px,-6px,0)' },
          '100%': { transform: 'translate3d(-3px,4px,0)' }
        },
        type: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glide: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(6px, -4px, 0)' },
          '100%': { transform: 'translate3d(-4px, 6px, 0)' }
        }
      },
      animation: {
        scan: 'scan 4.5s linear infinite',
        flicker: 'flicker 3.5s ease-in-out infinite',
        drift: 'drift 12s ease-in-out infinite',
        type: 'type 4s steps(28, end) infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        glide: 'glide 10s ease-in-out infinite'
      }
    },
  },
  plugins: [],
};

export default config;
