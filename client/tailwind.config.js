/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Preserve existing color scheme from CSS variables
        'page-bg': 'var(--page-bg)',
        'card-bg': 'var(--card-bg)',
        'ink-strong': 'var(--ink-strong)',
        'ink-muted': 'var(--ink-muted)',
        'ink-soft': 'var(--ink-soft)',
        'accent': 'var(--accent)',
        'accent-strong': 'var(--accent-strong)',
        'accent-soft': 'var(--accent-soft)',
        'border': 'var(--border)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
