/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: 'var(--font-heading)',
        body: 'var(--font-body)',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'float-up': 'floatUp 2s ease-out infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'gradient-x': 'gradient-x 3s ease infinite',
        'ping': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(1.5)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translate(-50%, 100%)' },
          '100%': { opacity: '1', transform: 'translate(-50%, 0)' }
        },
        floatUp: {
          '0%': { 
            transform: 'translateY(0) scale(1)',
            opacity: 0.4
          },
          '50%': { 
            transform: 'translateY(-12px) scale(1.1)',
            opacity: 1 
          },
          '100%': { 
            transform: 'translateY(-24px) scale(0.8)',
            opacity: 0 
          },
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        }
      },
    },
  },
  plugins: [],
};
