/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F7F4EC',
        'paper-dim': '#EFEADC',
        ink: '#14120E',
        'ink-soft': '#3A362E',
        muted: '#8A8578',
        yellow: '#FFC22E',
        'yellow-deep': '#E8A800',
        blue: '#2547FF',
        green: '#1FA463',
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
