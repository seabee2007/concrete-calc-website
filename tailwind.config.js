/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a0f1a',
          900: '#0f1729',
          800: '#152238',
        },
        charcoal: {
          900: '#1a1f2e',
          800: '#252b3b',
        },
        concrete: {
          300: '#b8bcc4',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
        },
        electric: {
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(6, 182, 212, 0.15), transparent)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.3)',
        card: '0 4px 24px rgba(0, 0, 0, 0.2)',
        glow: '0 0 40px rgba(6, 182, 212, 0.15)',
        'glow-lg': '0 0 60px rgba(6, 182, 212, 0.2)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
