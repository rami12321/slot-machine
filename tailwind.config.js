/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        casino: {
          bg: "#12090b",
          panel: "#1a0f12",
          red: "#9b0b16",
          redDeep: "#6d0710",
          gold: "#ffcc3d",
          goldDeep: "#cf9f1f",
          cream: "#f5e6c8",
          jade: "#0c7d5a",
        }
      },
      boxShadow: {
        'gold': '0 0 0 2px #cf9f1f, inset 0 0 14px rgba(255,204,61,.35), 0 12px 30px rgba(0,0,0,.6)',
        'bulb': '0 0 12px 4px rgba(255,204,61,.75)',
      },
      backgroundImage: {
        'cabinet': 'radial-gradient(1200px 500px at 50% -20%, rgba(255,204,61,.15), transparent), linear-gradient(180deg, #2a1619, #13090b)',
        'chrome': 'linear-gradient(180deg, #e8eef3 0%, #b7c0c8 15%, #8b949b 45%, #f7fbff 60%, #8a9298 85%, #2f3336 100%)',
        'goldShine': 'linear-gradient(135deg, #fff3b8 0%, #ffcc3d 30%, #cf9f1f 60%, #fff3b8 100%)',
        'glass': 'linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.02))'
      },
      keyframes: {
        bulb: { '0%,100%': { opacity: .9 }, '50%': { opacity: .4 } },
        marquee: { '0%': { transform: 'translateX(100%)' }, '100%': { transform: 'translateX(-100%)' } },
        shine: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        payline: { '0%': { opacity: 0 }, '10%': { opacity: 1 }, '90%': { opacity: 1 }, '100%': { opacity: 0 } },
        leverShadow: { '0%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(4px)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        bulb: 'bulb 1.6s ease-in-out infinite',
        marquee: 'marquee 12s linear infinite',
        shine: 'shine 2.8s linear infinite',
        payline: 'payline 1000ms ease-out forwards',
        leverShadow: 'leverShadow .5s ease-out',
      }
    }
  },
  plugins: [],
}
