/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FDFDFC',
          100: '#FBF6F3', // The gentle blush ivory
          200: '#F7EFF1',
          300: '#EADFDB', // Soft blush border
          400: '#D9CACF',
          500: '#A3969B',
          600: '#7D6F74',
          700: '#56484D',
          800: '#3A2F33', // Warm plum charcoal text
          900: '#261D21',
        },
        charcoal: {
          light: '#56484D',
          DEFAULT: '#3A2F33',
          deep: '#261D21',
        },
        aegis: {
          rose: {
            light: '#F7E6EC',
            border: '#E8C5D2',
            text: '#B4587A',
            accent: '#B4587A',
            hover: '#9F4868',
          },
          amber: {
            light: '#FBF0D9',
            border: '#F2DCA5',
            text: '#A0680A',
            accent: '#B87A10',
          },
          sage: {
            light: '#E4F3EC',
            border: '#BFE3D3',
            text: '#2E7D59',
            accent: '#3F9A73',
          },
          blue: {
            light: '#E3EEF7',
            border: '#BFD9EE',
            text: '#326E9C',
            accent: '#4E86B8',
          },
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(120, 80, 95, 0.05)',
        'lift': '0 6px 20px rgba(120, 80, 95, 0.09)',
      },
    },
  },
  plugins: [],
};
