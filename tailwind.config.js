/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './{components,context,emails,hooks,lib,pages,scripts,services,utils}/**/*.{js,ts,jsx,tsx}',
    './*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Helvetica', 'sans-serif'],
        display: ['Cinzel', 'serif'],
      },
      colors: {
        // Core Luxury Palette (8 colors)
        'brand-burgundy': '#722F37',
        'brand-burgundy-light': '#8B3D46',
        'brand-gold': '#D4AF37',
        'brand-ivory': '#FFFEF5',
        'brand-charcoal': '#2D2D2D',
        'brand-warm-gray': '#6B5B5B',
        'brand-dark': '#0F0F0F',
        'brand-light': '#F7F7F7',

        // Labs Theme Semantic Tokens
        'surface-1': '#FFFEF5', // Main background (Ivory)
        'surface-2': '#F2F0E9', // Secondary/Cards (Slightly darker)
        'surface-3': '#E6E4DD', // Teritary/Borders
        accent: '#722F37', // Action color (Burgundy)
      },
      spacing: {
        // Systematic spacing scale (8 units)
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },
      fontSize: {
        // Typography scale (6 sizes)
        hero: ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-lg': ['4rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'hero-xl': ['5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        display: ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        body: ['1rem', { lineHeight: '1.6' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
      },
      boxShadow: {
        // 4 elevation levels
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        luxury: '0 4px 20px rgba(114, 47, 55, 0.08)',
        'luxury-hover': '0 8px 30px rgba(114, 47, 55, 0.15)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #722F37 0%, #8B3D46 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 100%)',
      },
      animation: {
        // Essential animations only
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        shimmer: 'shimmer 2s infinite linear',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionDuration: {
        400: '400ms',
      },
    },
  },
  plugins: [],
};
