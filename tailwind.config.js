/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1C2340",
        accent: {
          DEFAULT: "#E05C2A",
          dark: "#C44F24",
        },
        background: "#F5F4F2",
        surface: "#FFFFFF",
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
        },
        border: "#E2E0DC",
      },
      fontFamily: {
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
        heading: ['Sora', 'sans-serif'],
      },
      borderRadius: {
        card: "12px",
        input: "8px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08)",
      }
    },
  },
  plugins: [],
}
