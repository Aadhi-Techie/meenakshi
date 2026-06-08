// ─────────────────────────────────────────────────────────────
//  tailwind.config.js
//  Maps the CSS custom properties from globals.css into Tailwind
//  so you can write `text-brand-orange` instead of `text-[#f97316]`.
//
//  Install Tailwind:
//    npm install -D tailwindcss postcss autoprefixer
//    npx tailwindcss init -p
//  Then uncomment the three @tailwind directives in globals.css.
// ─────────────────────────────────────────────────────────────

/** @type {import('tailwindcss').Config} */
export default {
  // ── Purge paths ─────────────────────────────────────────────
  // Tailwind scans these files and removes unused utilities in production.
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {

      // ── Color palette ──────────────────────────────────────
      // Mirrors the :root variables in globals.css.
      // Usage: bg-bg, text-brand-orange, border-brd, etc.
      colors: {
        // Backgrounds
        bg:  { DEFAULT: "#030918", 2: "#060f22", 3: "#091527", 4: "#0d1d38" },

        // Brand orange
        brand: {
          orange:      "#f97316",  // --o
          "orange-dk": "#ea580c",  // --o2
          "orange-lt": "#ff9448",  // --o3
        },

        // Accent colours
        gold:    "#f59e0b",   // --gold
        sky:     "#38bdf8",   // --sky
        emerald: "#34d399",   // --em
        violet:  "#a78bfa",   // --vi
        amber:   "#fbbf24",   // --am

        // Neutral / slate
        muted: {
          DEFAULT: "#94a3b8",  // --sl
          dark:    "#64748b",  // --sl2
          darker:  "#475569",  // --sl3
        },

        // Utility
        white:   "#f8fafc",   // --w
        success: "#22c55e",   // --gr
        danger:  "#ef4444",   // --re

        // Border (use as border-brd)
        brd: "rgba(255,255,255,0.07)",
      },

      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],  // headings
        sans:  ["'Outfit'", "sans-serif"],          // body (default)
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        sm:  "10px",   // --rd
        md:  "18px",   // --rdl
        xl:  "26px",   // --rdx
      },

      // ── Box shadows ────────────────────────────────────────
      boxShadow: {
        card:  "0 4px 24px rgba(0,0,0,0.5)",             // --sh
        lift:  "0 20px 70px rgba(0,0,0,0.6)",            // --shx
        glow:  "0 0 40px rgba(249,115,22,0.25)",          // --glow
        glowx: "0 0 80px rgba(249,115,22,0.4)",           // --glowx
        wa:    "0 4px 20px rgba(37,211,102,0.5)",         // WhatsApp button
      },

      // ── Custom keyframes ───────────────────────────────────
      // Keeps the named animations available as Tailwind utilities
      // (`animate-fade-up`, `animate-float`, etc.) even after the
      // @keyframe blocks are eventually removed from globals.css.
      keyframes: {
        "fade-up":  { from: { opacity: "0", transform: "translateY(32px)"  }, to: { opacity: "1", transform: "translateY(0)"   } },
        "fade-in":  { from: { opacity: "0" },                                  to: { opacity: "1" }                               },
        "scale-in": { from: { opacity: "0", transform: "scale(0.9)"         }, to: { opacity: "1", transform: "scale(1)"        } },
        "slide-l":  { from: { opacity: "0", transform: "translateX(-28px)"  }, to: { opacity: "1", transform: "translateX(0)"   } },
        "slide-r":  { from: { opacity: "0", transform: "translateX(28px)"   }, to: { opacity: "1", transform: "translateX(0)"   } },
        float:      { "0%,100%": { transform: "translateY(0)"                }, "50%": { transform: "translateY(-18px)"          } },
        "float-s":  { "0%,100%": { transform: "translateY(0) scale(1)"      }, "50%": { transform: "translateY(-10px) scale(1.04)" } },
        spin:       { to:   { transform: "rotate(360deg)" }                                                                        },
        "wa-ping":  {
          "0%,100%": { boxShadow: "0 0 0 0 rgba(37,211,102,0.55)"  },
          "70%":     { boxShadow: "0 0 0 16px rgba(37,211,102,0)"  },
        },
        shimmer: {
          from: { backgroundPosition: "-400px 0" },
          to:   { backgroundPosition:  "400px 0" },
        },
        orb: {
          "0%,100%": { transform: "scale(1)"    },
          "50%":     { transform: "scale(1.25)" },
        },
      },

      // ── Animation utilities ────────────────────────────────
      animation: {
        "fade-up":  "fade-up  0.75s ease both",
        "fade-in":  "fade-in  0.5s  ease both",
        "scale-in": "scale-in 0.5s  ease both",
        "slide-l":  "slide-l  0.65s ease both",
        "slide-r":  "slide-r  0.65s ease both",
        float:      "float    5s    ease-in-out infinite",
        "float-s":  "float-s  4s    ease-in-out infinite",
        "wa-ping":  "wa-ping  2.2s  infinite",
        shimmer:    "shimmer  1.6s  ease-in-out infinite",
        orb:        "orb      4s    ease-in-out infinite alternate",
      },

      // ── Max widths ─────────────────────────────────────────
      maxWidth: {
        wrap: "1240px",   // matches .wrap max-width
      },

      // ── Transition timing ──────────────────────────────────
      transitionTimingFunction: {
        card: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
    },
  },

  plugins: [],
};