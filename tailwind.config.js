/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        montecarlo: ['"MonteCarlo"', 'cursive'],
      },
      colors: {
        primary: '#4F46E5',
        
      },
      fontSize: {
        xxs: '0.625rem', 
      }
    },
  },
  plugins: [],
};



