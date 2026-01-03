/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx",
    ],
    theme: {
        extend: {
        colors: {
            'brand-red': '#f08377',
            'brand-bg': '#f4f7f6',
            'brand-text': '#333333',
            'brand-border': '#e0e0e0',
            'brand-dark': '#192730'
            },
            fontFamily: {
              heading: ['Orbitron', 'sans-serif'],
              body: ['Poppins', 'sans-serif'],
            }
        },
    },
    plugins: [],
}