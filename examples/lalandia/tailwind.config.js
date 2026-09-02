/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        lalandia: {
          lime: '#B9DF23',
          'lime-dark': '#76A70C',
          forest: '#185C36',
          yellow: '#FFBD0F',
          'yellow-light': '#FFE24A',
          amber: '#C27D00',
          aqua: '#3CC3D5',
          sky: '#3C99D8',
          ocean: '#006EB9',
          teal: '#028C98',
          ink: '#202020',
          mute: '#575757',
          soft: '#F5F5F5',
          offer: '#FDF1D2',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        lalandia: ['Roboto', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'lalandia-lime': 'linear-gradient(to bottom, #B9DF23, #76A70C)',
        'lalandia-cta': 'linear-gradient(180deg, #FFE24A, #FFBD0F)',
      },
      boxShadow: {
        lalandia: '0 8px 24px rgba(32, 32, 32, 0.12)',
      },
      borderRadius: {
        lalandia: '4px',
      },
    },
  },
  plugins: [],
};
