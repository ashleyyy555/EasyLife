/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        'medical-records': '#1CAF49',
        'location': '#E3A228',
        'emergency': '#E93838',
        'reports': '#D9D9D9'
      }
    },
  },
  plugins: [],
}