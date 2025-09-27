import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-default text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "bg-neutral-900 text-white shadow-button hover:shadow-button-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-none",
        secondary: "bg-white text-neutral-900 border border-neutral-300 hover:bg-neutral-50",
        default: "bg-neutral-900 text-white hover:bg-neutral-800",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-900",
        ghost: "hover:bg-neutral-100 text-neutral-700",
        link: "text-neutral-900 underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm has-[>svg]:px-2.5",
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        lg: "h-11 px-6 py-3 text-base has-[>svg]:px-5",
        xl: "h-12 px-8 py-4 text-lg has-[>svg]:px-7",
        icon: "size-10 rounded-default",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);


