/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: {
          DEFAULT: '#111216',
          raised: '#18191e',
          overlay: '#1c1e26',
          glass: 'rgba(17, 18, 22, 0.85)',
        },
        border: '#1f222a',
        primary: {
          DEFAULT: '#f59e0b',
          foreground: '#050505',
          dark: '#d97706',
          gold: '#f59e0b',
          amber: '#f59e0b',
        },
        pass: {
          DEFAULT: '#10b981',
          light: 'rgba(16, 185, 129, 0.15)',
          dark: '#059669',
        },
        fail: {
          DEFAULT: '#ef4444',
          light: 'rgba(239, 68, 68, 0.15)',
          dark: '#dc2626',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: 'rgba(245, 158, 11, 0.15)',
          dark: '#d97706',
        },
        muted: {
          DEFAULT: '#64748b',
          foreground: '#9ca3af',
        },
        cyber: {
          green: '#00ff9d',
          cyan: '#00e5ff',
          blue: '#0a84ff',
          amber: '#f59e0b',
          violet: '#7c5cff',
        },
        ink: {
          950: '#05070b',
          900: '#0a0e16',
          850: '#0d121d',
          800: '#111827',
          700: '#1a2233',
          600: '#243044',
        },
        risk: {
          low: '#00ff9d',
          medium: '#00e5ff',
          high: '#f59e0b',
          critical: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-amber': '0 0 20px rgba(245,158,11,0.35)',
        'glow-green': '0 0 20px rgba(16,185,129,0.35)',
        'glow-cyan': '0 0 20px rgba(0,229,255,0.35)',
        'glow-critical': '0 0 24px rgba(239,68,68,0.45)',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.6' },
          '55%': { opacity: '1' },
        },
        gridMove: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
        floatUp: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-100vh)', opacity: '0' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        scanline: 'scanline 6s linear infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        flicker: 'flicker 4s linear infinite',
        gridMove: 'gridMove 8s linear infinite',
        blink: 'blink 1s step-end infinite',
        floatUp: 'floatUp 8s linear infinite',
        spinSlow: 'spinSlow 20s linear infinite',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
