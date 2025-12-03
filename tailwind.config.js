/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
      fontFamily: {
        sans: ['var(--font-avantt)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-avantt)', 'system-ui', 'sans-serif'],
        screamer: ['var(--font-fk-screamer)', 'system-ui', 'sans-serif'],
        avantt: ['var(--font-avantt)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
