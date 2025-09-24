/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // 기존 shadcn/ui 색상 유지
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 크롤링된 디자인 시스템 색상 추가
        brand: {
          primary: 'rgb(129, 140, 248)',
          secondary: 'rgb(79, 70, 229)',
          accent: 'rgb(0, 172, 48)',
        },
        neutral: {
          50: 'rgb(250, 250, 250)',
          100: 'rgb(241, 241, 241)',
          200: 'rgb(235, 235, 235)',
          300: 'rgb(209, 213, 219)',
          400: 'rgb(156, 163, 175)',
          500: 'rgb(129, 129, 129)',
          600: 'rgb(71, 71, 71)',
          700: 'rgb(51, 51, 51)',
          800: 'rgb(33, 33, 33)',
          900: 'rgb(20, 20, 20)',
          950: 'rgb(17, 17, 17)',
        },
        dark: {
          900: 'rgb(17, 17, 17)',
          800: 'rgb(33, 33, 33)',
          700: 'rgb(51, 51, 51)',
          600: 'rgb(71, 71, 71)',
          500: 'rgb(129, 129, 129)',
          400: 'rgb(156, 163, 175)',
          300: 'rgb(209, 213, 219)',
        }
      },
      fontFamily: {
        'heading': ['Gabarito', 'sans-serif'],
        'body': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // 디자인 시스템 추가
        'xs': '4px',
        'default': '6px',
        'xl': '16px',
        '2xl': '24px',
      },
      boxShadow: {
        'button': '0 3px 0 0 rgb(20 20 20)',
        'button-hover': '0 1px 0 0 rgb(20 20 20)',
        'card': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'ring': '0 0 0 2px rgb(129 140 248)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, rgb(129, 140, 248) 0%, rgb(79, 70, 229) 100%)',
        'gradient-accent': 'linear-gradient(135deg, rgb(99, 102, 241) 0%, rgb(217, 70, 239) 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgb(51, 51, 51) 0%, rgb(17, 17, 17) 100%)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

