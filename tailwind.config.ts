import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oatmeal: '#F5F4EF',
        cream: '#FAF8F5',
        charcoal: '#2C2C2C',
        ink: '#1A3A3A',
        terracotta: '#B85C4B',
        sage: '#7A8B6F',
        rust: '#C17B5F',
        forest: '#2D4A3E',
      },
      fontFamily: {
        serif: ['Noto Serif SC', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
export default config
