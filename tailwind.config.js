/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'pure-white': '#ffffff',
        'soft-white': '#fafafa',
        'pearl': '#f7f7f7',
        'mist': '#f0f0f0',
        'cloud': '#e8e8e8',
        'silver': '#d4d4d4',
        'ash': '#b8b8b8',
        'graphite': '#888888',
        'charcoal': '#555555',
        'ink': '#2a2a2a',
        'pure-black': '#000000',
      },
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px  
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
        '3xl': '4rem',     // 64px
      },
      borderRadius: {
        'xs': '6px',
        'sm': '10px', 
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
        'full': '9999px',
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.02)',
        'soft': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'strong': '0 8px 32px rgba(0, 0, 0, 0.08)',
        'float': '0 16px 48px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'ease-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ease-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      letterSpacing: {
        'tight': '-0.02em',
        'normal': '-0.011em',
        'wide': '0.05em',
        'wider': '0.12em',
      },
      animation: {
        'float': 'float 25s infinite ease-in-out',
        'float-delayed': 'float 30s infinite ease-in-out',
        'float-slow': 'float 35s infinite ease-in-out',
        'slideUp': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'fadeIn': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'ripple': 'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'pulse': 'pulse 2s infinite cubic-bezier(0.65, 0, 0.35, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translate(0, 0) scale(1)' 
          },
          '33%': { 
            transform: 'translate(30px, -30px) scale(1.05)' 
          },
          '66%': { 
            transform: 'translate(-20px, 20px) scale(0.95)' 
          },
        },
        slideUp: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        ripple: {
          '0%': {
            top: '36px',
            left: '36px',
            width: '0',
            height: '0',
            opacity: '1',
          },
          '100%': {
            top: '0px',
            left: '0px',
            width: '72px',
            height: '72px',
            opacity: '0',
          },
        },
      },
    },
  },
  plugins: [],
};