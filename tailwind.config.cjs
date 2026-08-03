/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          sky: "#0ea5e9",
          amber: "#f59e0b",
          emerald: "#10b981",
        },
      },
      boxShadow: {
        panel: "0 12px 35px -20px rgba(15, 23, 42, 0.4)",
      },
    },
  },
  plugins: [],
};
