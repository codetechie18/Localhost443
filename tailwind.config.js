/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        pending: "hsl(var(--pending))",
        "in-progress": "hsl(var(--in-progress))",
        resolved: "hsl(var(--resolved))",
        sidebar: "hsl(var(--sidebar))",
        "sidebar-foreground": "hsl(var(--sidebar-foreground))",
        "sidebar-border": "hsl(var(--sidebar-border))",
        "sidebar-accent": "hsl(var(--sidebar-accent))",
        "sidebar-primary": "hsl(var(--sidebar-primary))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
      },
    },
  },
  plugins: [],
};