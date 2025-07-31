// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#292833',
        'form-bg': '#3a394a',
        'input-bg': '#403f4c',
        'button-dark': '#5c5a6b',
        'button-light-hover': '#7a788e',
        'text-light': '#f3f3f3',
        'text-accent': '#c3f0ca',
        'border-color': '#9eacc9',
        'status-text': '#a7c4f2',
        'education-green': '#28a745', /* Originally .active-green */
        'education-red': '#dc3545',   /* Originally .active-red */
        'result-header-bg': '#403f4c',
        'result-subheader-bg': '#5c5a6b',
        'result-table-border': '#5c5a6b',
        // Example if you need specific result cells color, e.g. from original image
        'result-value-blue': '#1e3a8a', // Darker blue for total AK (approx)
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      spacing: {
        'px-20': '20px',
        'px-30': '30px',
        'px-10': '10px',
        'px-15': '15px',
        'px-12': '12px',
        'px-17': '17px',
        'px-21': '21px',
        'px-11': '11px',
        'px-5': '5px',
        'px-8_5': '8.5px', // Custom value for padding
        'px-14_25': '14.25px', // Custom value for padding
        'px-13_5': '13.5px', // Custom value for padding
        'px-9_5': '9.5px', // Custom value for padding
        'px-6': '6px',
        'px-19': '19px',
      },
      minWidth: {
        'min-w-160': '160px',
      },
    },
  },
  plugins: [],
}