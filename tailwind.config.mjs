/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        marino:  '#1B2E4E',
        corp:    '#2E5090',
        medio:   '#5B8CC8',
        cielo:   '#9EC3E8',
        negro:   '#1C1C1E',
        gris:    '#6B6B6B',
        fondo:   '#F4F7FB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      maxWidth: {
        site: '1200px',
      },
    },
  },
  plugins: [],
};
