import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#070A0F',
          dark: '#0B0F14',
          lighter: '#0F1623',
        },
        card: {
          DEFAULT: '#0F1623',
          hover: '#141C2D',
          border: '#1E293B',
        },
        text: {
          DEFAULT: '#E6EAF2',
          muted: '#9AA4B2',
          disabled: '#6B7280',
        },
        accent: {
          DEFAULT: '#00E676',
          hover: '#14F195',
          dark: '#00C853',
        },
        danger: {
          DEFAULT: '#FF4D4D',
          hover: '#FF6B6B',
        },
        success: {
          DEFAULT: '#00E676',
        },
        warning: {
          DEFAULT: '#FFC107',
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;