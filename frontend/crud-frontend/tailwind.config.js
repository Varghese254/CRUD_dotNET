/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8', // sky-400
          500: '#0ea5e9', // sky-500
          600: '#0284c7', // sky-600
          700: '#0369a1', // sky-700
          800: '#075985', // sky-800
          900: '#0c4a6e', // sky-900
          950: '#082f49',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // blue-500
          600: '#2563eb', // blue-600
          700: '#1d4ed8', // blue-700
          800: '#1e40af', // blue-800
          900: '#1e3a8a', // blue-900
          950: '#172554',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'professional': '0 10px 40px -15px rgba(0,0,0,0.3)',
      }
    },
  },
  plugins: [],
}