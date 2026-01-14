/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Lato', 'Poppins', 'Inter', 'sans-serif'],
        display: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // Enhanced Luxury Color Palette
        'brand-burgundy': '#722F37',
        'brand-burgundy-light': '#8B3D46',
        'brand-burgundy-dark': '#5A252C',
        'brand-gold': '#D4AF37',
        'brand-gold-light': '#E5C76B',
        'brand-gold-dark': '#B8962E',
        'brand-rose': '#B76E79',
        'brand-ivory': '#FFFEF5',
        'brand-cream': '#FAEBD7',
        'brand-charcoal': '#2D2D2D',
        'brand-warm-gray': '#6B5B5B',
        'brand-dark': '#1a1a1a',
        'brand-light': '#f7f7f7',

        // Modern Color Additions
        'brand-sage': '#84A98C',
        'brand-slate': '#5A6C7D',
        'brand-coral': '#F4A261',
        'brand-emerald': '#2A9D8F',
        'brand-lavender': '#B794F6',

        // Dark Mode Colors
        'dark-bg': '#0F0F0F',
        'dark-surface': '#1A1A1A',
        'dark-surface-elevated': '#252525',
        'dark-border': '#333333',
        'dark-text': '#E5E5E5',
        'dark-text-secondary': '#A3A3A3',
        'dark-accent': '#F59E0B',
      },
      boxShadow: {
        luxury: '0 4px 20px rgba(114, 47, 55, 0.08)',
        'luxury-hover': '0 8px 30px rgba(114, 47, 55, 0.15)',
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        card: '0 2px 15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 10px 40px rgba(0, 0, 0, 0.12)',
        // Modern shadows
        glass: '0 8px 32px rgba(0, 0, 0, 0.12)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        neumorph: '8px 8px 16px #d1d1d1, -8px -8px 16px #ffffff',
        'neumorph-inset': 'inset 4px 4px 8px #d1d1d1, inset -4px -4px 8px #ffffff',
        'glow-lg': '0 0 30px rgba(212, 175, 55, 0.4)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #722F37 0%, #8B3D46 50%, #722F37 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E5C76B 50%, #D4AF37 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
        // Modern gradients
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-rainbow': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.5)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Modern animations
        bounceIn: {
          '0%': { opacity: '0', transform: 'scale(0.3)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        rotateIn: {
          '0%': { opacity: '0', transform: 'rotate(-180deg) scale(0)' },
          '100%': { opacity: '1', transform: 'rotate(0deg) scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '50%' },
          '50%': { borderRadius: '25%' },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-down': 'slideInDown 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        // Modern animations
        'bounce-in': 'bounceIn 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'rotate-in': 'rotateIn 0.6s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        morph: 'morph 2s ease-in-out infinite',
        typewriter: 'typewriter 2s steps(40, end)',
      },
      letterSpacing: {
        luxury: '0.15em',
        'wide-luxury': '0.25em',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.4, 0, 0.2, 1)',
        bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
