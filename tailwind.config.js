/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Press Start 2P"', 'monospace'],
        body:    ['"VT323"', 'monospace'],
        ui:      ['"Pixelify Sans"', 'monospace'],
      },
      colors: {
        pu: {
          bg:    '#6B21A8',
          deep:  '#4A0E8F',
          panel: '#EDE9FE',
          light: '#DDD6FE',
          mid:   '#A78BFA',
          border:'#1A0030',
        },
        pk: {
          hot:   '#FF2D9B',
          light: '#FFB3E0',
          pale:  '#FFE4F3',
        },
        te: { y2k: '#00C9B1' },
        am: { y2k: '#F5A623' },
      },
      boxShadow: {
        y2k:      '4px 4px 0px #1A0030',
        'y2k-lg': '6px 6px 0px #1A0030',
        'y2k-pk': '4px 4px 0px #9B0060',
      },
    },
  },
  plugins: [],
}