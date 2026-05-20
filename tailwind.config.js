export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#030305",
          charcoal: "#0B0B12",
          darkGray: "#12121a",
          cyan: "#00E5FF",
          purple: "#D946EF",
          magenta: "#D946EF",
          white: "#F8F9FA",
          orange: "#FF3B00",
          green: "#00FF9D",
          slate: "#9BA3AF"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
        outfit: ["Outfit", "sans-serif"]
      },
      boxShadow: {
        "glow-cyan": "0 0 15px rgba(0, 229, 255, 0.35), 0 0 40px rgba(0, 229, 255, 0.15)",
        "glow-cyan-lg": "0 0 30px rgba(0, 229, 255, 0.5), 0 0 80px rgba(0, 229, 255, 0.2)",
        "glow-purple": "0 0 15px rgba(217, 70, 239, 0.35), 0 0 40px rgba(217, 70, 239, 0.15)",
        "glow-purple-lg": "0 0 30px rgba(217, 70, 239, 0.5), 0 0 80px rgba(217, 70, 239, 0.2)",
        "glow-orange": "0 0 15px rgba(255, 59, 0, 0.35), 0 0 40px rgba(255, 59, 0, 0.15)",
        "hud": "0 0 1px rgba(0, 229, 255, 0.6), inset 0 0 1px rgba(0, 229, 255, 0.3)"
      },
      backdropBlur: {
        xs: "2px"
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100"
      },
      animation: {
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "scanline": "scanline 8s linear infinite",
        "flicker": "flicker 4s linear infinite",
        "hud-fade-in": "hud-fade-in 0.6s ease-out forwards",
        "boot-line": "boot-line 0.4s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "spin-slow": "spin 20s linear infinite"
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "brightness(1)" },
          "50%": { opacity: "1", filter: "brightness(1.3)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" }
        },
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" }
        },
        "flicker": {
          "0%, 100%": { opacity: "1" },
          "41%": { opacity: "1" },
          "42%": { opacity: "0.8" },
          "43%": { opacity: "1" },
          "44%": { opacity: "0.6" },
          "45%": { opacity: "1" },
          "80%": { opacity: "1" },
          "81%": { opacity: "0.7" },
          "82%": { opacity: "1" }
        },
        "hud-fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" }
        },
        "boot-line": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(255, 255, 255, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(255, 255, 255, 0.6), 0 0 50px rgba(255, 255, 255, 0.2)" }
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      }
    }
  },
  plugins: []
}
