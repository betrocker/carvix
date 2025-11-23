/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Brand
        "carvix-orange": "#F97316", // Carvix Orange
        "carvix-flame": "#FB323C", // Carvix Flame

        // Dark palette
        "carvix-carbon": "#1F242D",
        "carvix-graphite": "#0D1117",

        // Neutrals
        "carvix-titanium": "#9CA3AF",
        "carvix-electric-grey": "#E5E7EB",

        // Accents
        "carvix-cyan": "#22DDEE",
        "carvix-warning": "#FACC15",
        "carvix-error": "#EF4444",

        // Backgrounds
        "carvix-bg-light": "#FFFFFF",
        "carvix-bg-light-card": "#F5F5F5",
        "carvix-bg-dark": "#0B0D12",
        "carvix-bg-dark-card": "#14171D",

        // Text helpers
        "carvix-text": "#111827",
        "carvix-text-muted": "#6B7280",
      },
      fontFamily: {
        sans: ["Inter", "system-ui"],
        inter: ["Inter"],
        "inter-medium": ["Inter-Medium"],
        "inter-bold": ["Inter-Bold"],
      },
    },
  },
  plugins: [],
};
